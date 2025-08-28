import { BACKEND_URL } from "@/constant";
import axios from "axios";
import React, { useState } from "react";

export default function MultiStepPatientForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    date: "",
    gender: "",
    bloodGroup: "",
    allergies: "",
    medications: "",
    medicalHistory: "",
    leftEyeImage: null,
    rightEyeImage: null,
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [leftEyePrediction, setLeftEyePrediction] = useState(null);
  const [rightEyePrediction, setRightEyePrediction] = useState(null);
  const [leftEyeAdditionalData, setLeftEyeAdditionalData] = useState(null);
  const [rightEyeAdditionalData, setRightEyeAdditionalData] = useState(null);

  const showToast = (title, message, type = "error") => {
    setToastMessage({ title, message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) {
      showToast("Error", "Please fill in all required fields");
      return;
    }

    if (step === 2 && !formData.leftEyeImage) {
      showToast("Error", "Please upload left eye image");
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const validateStep1 = () => {
    const requiredFields = ["name", "age", "date", "gender", "bloodGroup"];
    return requiredFields.every((field) => formData[field]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (eye) => (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("Error", "File size should be less than 5MB");
        return;
      }

      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        showToast("Error", "Only JPEG, PNG and GIF files are allowed");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [eye]: file,
      }));
    }
  };

  const processAdditionalData = async (eye) => {
    try {
      const imageFormData = new FormData();
      imageFormData.append("image", formData[eye]);

      const response = await axios.post(
        "http://127.0.0.1:6000/predict",
        imageFormData
      );

      return response.data;
    } catch (error) {
      console.error(`Error processing additional data for ${eye}:`, error);
      showToast("Error", `Failed to process additional analysis for ${eye}`);
      throw error;
    }
  };

  const processEyeImage = async (eye) => {
    try {
      const imageFormData = new FormData();
      imageFormData.append("image", formData[eye]);

      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        imageFormData
      );

      // If prediction_class is 5, get additional data
      // let additionalData = null;
      // if (response.data.predicted_class === 5) {
        // additionalData = await processAdditionalData(eye);
        const additionalData = null
        // }

      return {
        prediction: response.data,
        additionalData: additionalData
      };
    } catch (error) {
      console.error(`Error processing ${eye}:`, error);
      showToast("Error", `Failed to process ${eye}. Please try again.`);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!formData.rightEyeImage) {
      showToast("Error", "Please upload right eye image");
      return;
    }

    try {
      setIsSubmitting(true);

      // Get predictions and additional data if needed
      const leftEyeResults = await processEyeImage("leftEyeImage");
      const rightEyeResults = await processEyeImage("rightEyeImage");

      // Update state with all results
      setLeftEyePrediction(leftEyeResults.prediction);
      setRightEyePrediction(rightEyeResults.prediction);
      setLeftEyeAdditionalData(leftEyeResults.additionalData);
      setRightEyeAdditionalData(rightEyeResults.additionalData);

      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("bloodGroup", formData.bloodGroup);
      formDataToSend.append("allergies", formData.allergies);
      formDataToSend.append("medications", formData.medications);
      formDataToSend.append("medicalHistory", formData.medicalHistory);
      
      // Append files and all predictions
      if (formData.leftEyeImage) {
        formDataToSend.append("leftEyeImage", formData.leftEyeImage);
        formDataToSend.append("leftEyePrediction", JSON.stringify(leftEyeResults.prediction));
        if (leftEyeResults.additionalData) {
          formDataToSend.append("leftEyeHRPrediction", JSON.stringify(leftEyeResults.additionalData));
        }
      }
      if (formData.rightEyeImage) {
        formDataToSend.append("rightEyeImage", formData.rightEyeImage);
        formDataToSend.append("rightEyePrediction", JSON.stringify(rightEyeResults.prediction));
        if (rightEyeResults.additionalData) {
          formDataToSend.append("rightEyeHRPrediction", JSON.stringify(rightEyeResults.additionalData));
        }
      }

      const response = await fetch(`${BACKEND_URL}/patients`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      showToast("Success", "Patient registered successfully!", "success");
      // setFormData(null)
      // setStep(0)
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast("Error", "Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-blue-50">
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 max-w-md p-4 rounded-lg shadow-xl transform transition-all duration-500 ${
            toastMessage.type === "success" ? "bg-emerald-500" : "bg-red-500"
          } text-white`}
        >
          <h4 className="font-semibold">{toastMessage.title}</h4>
          <p className="text-sm mt-1">{toastMessage.message}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Patient Registration
            </h1>
            <p className="mt-2 text-gray-600">
              Please fill in the required information
            </p>
          </div>

          <div className="flex justify-between items-center mb-8">
            {["Patient Information", "Left Eye", "Right Eye"].map(
              (stage, idx) => (
                <div key={idx} className="flex flex-col items-center w-1/3">
                  <div
                    className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-2
                  ${
                    idx + 1 === step
                      ? "bg-blue-100 text-blue-600 ring-2 ring-blue-600"
                      : idx + 1 < step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-400"
                  }
                `}
                  >
                    {idx + 1 < step ? "✓" : idx + 1}
                  </div>
                  <span
                    className={`text-sm ${
                      idx + 1 === step
                        ? "text-blue-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {stage}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="mb-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                      placeholder="Enter patient's full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                      placeholder="Enter age"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group *
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                    >
                      <option value="">Select blood group</option>
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                        (group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergies
                  </label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base min-h-[120px] resize-y"
                    placeholder="List any known allergies"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base min-h-[120px] resize-y"
                    placeholder="List current medications"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical History
                  </label>
                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base min-h-[120px] resize-y"
                    placeholder="Enter relevant medical history"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Left Eye Fundus Image
                </h3>
                <div
                  className={`border-2 ${
                    formData.leftEyeImage
                      ? "border-blue-500 bg-blue-50"
                      : "border-dashed border-gray-300"
                  } rounded-lg p-6 text-center transition-colors`}
                >
                  <input
                    type="file"
                    id="left-eye-upload"
                    className="hidden"
                    onChange={handleFileChange("leftEyeImage")}
                    accept="image/*"
                  />
                  {!formData.leftEyeImage ? (
                    <label htmlFor="left-eye-upload" className="cursor-pointer">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-600">
                        Click to upload left eye image
                      </span>
                      <p className="text-sm text-gray-500 mt-2">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </label>
                  ) : (
                    <div className="text-center">
                      <div className="text-blue-600 font-medium mb-2">
                        Image Uploaded Successfully
                      </div>
                      <div className="text-sm text-blue-500">
                        {formData.leftEyeImage.name}
                      </div>
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            leftEyeImage: null,
                          }))
                        }
                        className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Change Image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Right Eye Fundus Image
                </h3>
                <div
                  className={`border-2 ${
                    formData.rightEyeImage
                      ? "border-blue-500 bg-blue-50"
                      : "border-dashed border-gray-300"
                  } rounded-lg p-6 text-center transition-colors`}
                >
                  <input
                    type="file"
                    id="right-eye-upload"
                    className="hidden"
                    onChange={handleFileChange("rightEyeImage")}
                    accept="image/*"
                  />
                  {!formData.rightEyeImage ? (
                    <label
                      htmlFor="right-eye-upload"
                      className="cursor-pointer"
                    >
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-600">
                        Click to upload right eye image
                      </span>
                      <p className="text-sm text-gray-500 mt-2">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </label>
                  ) : (
                    <div className="text-center">
                      <div className="text-blue-600 font-medium mb-2">
                        Image Uploaded Successfully
                      </div>
                      <div className="text-sm text-blue-500">
                        {formData.rightEyeImage.name}
                      </div>
                      <button
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            rightEyeImage: null,
                          }))
                        }
                        className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Change Image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between pt-4 border-t border-gray-200">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
            )}
            <button
              onClick={step === 3 ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-auto
                ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? "Processing..." : step === 3 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
