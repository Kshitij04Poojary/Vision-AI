import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { BACKEND_URL } from "@/constant";

const classLabels = {
  0: "Severe",
  1: "Moderate",
  2: "Mild",
};

const AllPatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/patients/`);
        console.log(response);

        setPatients(response.data.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getPredictionLabel = (prediction) => {
    try {
      const predictionObj = JSON.parse(prediction);
      return classLabels[predictionObj.predicted_class] || "Unknown";
    } catch (error) {
      return "Invalid prediction data";
    }
  };

  const PatientDetailsModal = ({ patient, isOpen, onClose }) => {
    if (!patient) return null;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <p>
                    <span className="font-medium">Name:</span> {patient.name}
                  </p>
                  <p>
                    <span className="font-medium">Age:</span> {patient.age}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {patient.gender}
                  </p>
                  <p>
                    <span className="font-medium">Blood Group:</span>{" "}
                    {patient.bloodGroup}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Medical Information</h3>
                  <p>
                    <span className="font-medium">Allergies:</span>{" "}
                    {patient.allergies || "None"}
                  </p>
                  <p>
                    <span className="font-medium">Medications:</span>{" "}
                    {patient.medications || "None"}
                  </p>
                  <p>
                    <span className="font-medium">Medical History:</span>{" "}
                    {patient.medicalHistory || "None"}
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Eye Examination Results: <strong> Hypertensive Retinopathy</strong></h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Left Eye Prediction:</p>
                    <p>{getPredictionLabel(patient.leftEyePrediction)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Right Eye Prediction:</p>
                    <p>{getPredictionLabel(patient.rightEyePrediction)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Patient Records</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Left Eye</TableHead>
              <TableHead>Right Eye</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient._id}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.bloodGroup}</TableCell>
                <TableCell>
                  {getPredictionLabel(patient.leftEyePrediction)}
                </TableCell>
                <TableCell>
                  {getPredictionLabel(patient.rightEyePrediction)}
                </TableCell>
                <TableCell>{formatDate(patient.date)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedPatient(patient);
                      setIsModalOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PatientDetailsModal
        patient={selectedPatient}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPatient(null);
        }}
      />
    </div>
  );
};

export default AllPatientRecords;
