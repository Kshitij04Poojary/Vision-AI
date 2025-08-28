import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const APP_ID = 425786426;
const SERVER_SECRET = '7528254a2ea2aedc5613598b33fe68ec';
const BACKEND_URL = "http://localhost:3000";

function ConsultationRoom({ user }) {
  const [isDoctor, setIsDoctor] = useState(false);
  const [consultationRequested, setConsultationRequested] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const [consultationConnected, setConsultationConnected] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const socketRef = useRef(null);
  
  useEffect(() => {
    const doctorRole = user.role === "Doctor";
    setIsDoctor(doctorRole);
    console.log("User role:", user.role, "Is doctor:", doctorRole);

    socketRef.current = io(BACKEND_URL, {
      withCredentials: true,
      autoConnect: true
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected with ID:', socketRef.current.id);
      
      socketRef.current.emit('register', { 
        userId: user._id, 
        role: user.role,
        name: user.name 
      });
      console.log('Registered user:', { userId: user._id, role: user.role, name: user.name });
    });

    socketRef.current.on('consultation_request', (data) => {
      console.log('Received consultation request:', data);
      setConsultationRequested(true);
      setPatientDetails(data);
      setRoomId(data.roomId);
    });

    socketRef.current.on('request_response', (data) => {
      console.log('Received request response:', data);
      if (data.accepted) {
        setConsultationConnected(true);
        setRoomId(data.roomId);
      } else {
        alert("Doctor declined the consultation request");
        setConsultationRequested(false);
      }
    });

    socketRef.current.on('consultation_started', (data) => {
      console.log('Consultation started:', data);
      setConsultationConnected(true);
      setRoomId(data.roomId);
    });

    socketRef.current.on('consultation_ended', () => {
      console.log('Consultation ended');
      setConsultationConnected(false);
      setConsultationRequested(false);
      setRoomId(null);
      setPatientDetails(null);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      if (socketRef.current) {
        console.log('Disconnecting socket');
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  const startZegoCall = async () => {
    try {
      const userID = isDoctor ? `doctor_${user._id}` : `patient_${user._id}`;
      const userName = isDoctor ? `Dr. ${user.name}` : user.name;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        APP_ID,
        SERVER_SECRET,
        roomId,
        userID,
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: document.getElementById("zego-container"),
        scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
        showScreenSharingButton: isDoctor,
        showPreJoinView: true,
        showUserList: true,
        showTextChat: true,
        layout: "Auto",
        maxUsers: 2,
        preJoinViewConfig: {
          title: `${isDoctor ? 'Doctor' : 'Patient'} Consultation Room`,
        },
        onUserLeave: () => {
          socketRef.current.emit('end_consultation', {
            roomId,
            userId: user._id,
            role: user.role
          });
        }
      });
    } catch (error) {
      console.error("Error starting Zego call:", error);
    }
  };

  const requestConsultation = () => {
    console.log('Requesting consultation');
    socketRef.current.emit('request_consultation', {
      patientId: user._id,
      patientName: user.name
    });
    setConsultationRequested(true);
  };

  const handleConsultationResponse = (accept) => {
    console.log('Responding to consultation:', accept);
    socketRef.current.emit('respond_to_request', {
      accepted: accept,
      patientId: patientDetails.patientId,
      doctorId: user._id,
      roomId: roomId
    });

    if (accept) {
      setConsultationConnected(true);
    } else {
      setConsultationRequested(false);
      setPatientDetails(null);
    }
  };

  useEffect(() => {
    if (consultationConnected && roomId) {
      startZegoCall();
    }
  }, [consultationConnected, roomId]);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-4">
        {isDoctor ? "Doctor" : "Patient"} Consultation Room
      </h1>

      {!isDoctor && !consultationConnected && !consultationRequested && (
        <button
          onClick={requestConsultation}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Request Consultation
        </button>
      )}

      {!isDoctor && consultationRequested && !consultationConnected && (
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-lg">Waiting for doctor to accept your request...</p>
        </div>
      )}

      {isDoctor && consultationRequested && !consultationConnected && (
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-lg font-medium mb-2">
            Incoming consultation request from:
          </p>
          <p className="mb-4">Patient: {patientDetails?.patientName}</p>
          <div className="flex space-x-4">
            <button
              onClick={() => handleConsultationResponse(true)}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={() => handleConsultationResponse(false)}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {consultationConnected && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div
            id="zego-container"
            className="w-full h-[600px] bg-gray-50 rounded-lg"
          ></div>
        </div>
      )}
    </div>
  );
}

export default ConsultationRoom;