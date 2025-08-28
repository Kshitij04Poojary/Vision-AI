import React from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";
import './Dashboard.css'

const Dashboard = () => {
    return (
        <>
            <PowerBIEmbed
                embedConfig={{
                    type: "report",
                    id: "a2412c11-ec3c-48fe-adaf-b1511d837ddf",
                    embedUrl:
                        "https://app.powerbi.com/reportEmbed?reportId=a2412c11-ec3c-48fe-adaf-b1511d837ddf&groupId=88112a4d-ce8c-4d69-b4bd-2422b2a3b200&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUVBU1QtQVNJQS1DLVBSSU1BUlktcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7InVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d",
                    accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImltaTBZMnowZFlLeEJ0dEFxS19UdDVoWUJUayIsImtpZCI6ImltaTBZMnowZFlLeEJ0dEFxS19UdDVoWUJUayJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZDFmMTQzNDgtZjFiNS00YTA5LWFjOTktN2ViZjIxM2NiYzgxLyIsImlhdCI6MTczOTk0NzA1MCwibmJmIjoxNzM5OTQ3MDUwLCJleHAiOjE3Mzk5NTIzOTQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84WkFBQUEzOFdBd05BZG9FYWphNGpVSjk4UmZYZWU3Sjk0RWZjRzh5UzQvN0t3Wm1sVUpMQ2RZeG96RlRFaWRWb2NGdGtYIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6IjIzZDhmNmJkLTFlYjAtNGNjMi1hMDhjLTdiZjUyNWM2N2JjZCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiSkFJTiIsImdpdmVuX25hbWUiOiJLVVNIIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMjQwOTo0MDgxOmFjODM6NjQ0OTo0MjU6OWJjYzo2YzA6NjU2OCIsIm5hbWUiOiJLVVNIIEpBSU4gLSA2MDAwNDIyMDIzMCIsIm9pZCI6IjY3ZjA3MDQxLTk3ZDgtNDRiYy05NjZkLWQxMGJjZGViNzNkOCIsInB1aWQiOiIxMDAzMjAwMjcyNkVFMjE2IiwicmgiOiIxLkFUMEFTRVB4MGJYeENVcXNtWDZfSVR5OGdRa0FBQUFBQUFBQXdBQUFBQUFBQUFBOUFKYzlBQS4iLCJzY3AiOiJBcHAuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZC5BbGwgQ2FwYWNpdHkuUmVhZFdyaXRlLkFsbCBDb250ZW50LkNyZWF0ZSBEYXNoYm9hcmQuUmVhZC5BbGwgRGFzaGJvYXJkLlJlYWRXcml0ZS5BbGwgRGF0YWZsb3cuUmVhZC5BbGwgRGF0YWZsb3cuUmVhZFdyaXRlLkFsbCBEYXRhc2V0LlJlYWQuQWxsIERhdGFzZXQuUmVhZFdyaXRlLkFsbCBHYXRld2F5LlJlYWQuQWxsIEdhdGV3YXkuUmVhZFdyaXRlLkFsbCBQaXBlbGluZS5EZXBsb3kgUGlwZWxpbmUuUmVhZC5BbGwgUGlwZWxpbmUuUmVhZFdyaXRlLkFsbCBSZXBvcnQuUmVhZC5BbGwgUmVwb3J0LlJlYWRXcml0ZS5BbGwgU3RvcmFnZUFjY291bnQuUmVhZC5BbGwgU3RvcmFnZUFjY291bnQuUmVhZFdyaXRlLkFsbCBUZW5hbnQuUmVhZC5BbGwgVGVuYW50LlJlYWRXcml0ZS5BbGwgVXNlclN0YXRlLlJlYWRXcml0ZS5BbGwgV29ya3NwYWNlLlJlYWQuQWxsIFdvcmtzcGFjZS5SZWFkV3JpdGUuQWxsIiwic2lkIjoiMDAyMTcyOTktYmQxOS00MjEyLTY5ZWItNWIxNzViZWY3NGJhIiwic3ViIjoiRGU2ZmE5VmhDVkhKZVd5QVh4NHRpOWdSNXB5QjlkTFg5LUxIYWYtX1hDSSIsInRpZCI6ImQxZjE0MzQ4LWYxYjUtNGEwOS1hYzk5LTdlYmYyMTNjYmM4MSIsInVuaXF1ZV9uYW1lIjoiS1VTSC5KQUlOMjMwQHN2a21tdW1iYWkub25taWNyb3NvZnQuY29tIiwidXBuIjoiS1VTSC5KQUlOMjMwQHN2a21tdW1iYWkub25taWNyb3NvZnQuY29tIiwidXRpIjoiYUNzZ00yRkRNVTZkd2xSOWltVXlBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19pZHJlbCI6IjMwIDEifQ.Q2Zus7vNSx80OcChDEGpL_0xrrLjyLiy5dG5dcUqE_wqzec0_Xz-FWDmKDAFytbM0L7LBO7iiwtmaYPnyXsK2WxhbsWSoAg_ahS8NekyogsThbLxiefdPGp_1su00mfXPUEr9geiEVtl8t-D1KzZU_SmR06hGVJPGQ5dZg4Gs2s3fzBk4XHLWz5APBm7JWJ488r_EXlKMvZ_T7Ib2h5treCyrmTyy1JfgQSz4UuJ-hriddkAro8_wHKhBwceIMzJs4B_2KrwcrEUkkGEtebAGksYM8fvoE4YvkJmON8tnTPkYZKBXSCozBFCqyIU5x7Ix6aVU281PUQR5G7cAjbcAA",
                    tokenType: models.TokenType.Aad,
                    settings: {
                        panes: {
                            filters: {
                                expanded: false,
                                visible: false,
                            },
                        },
                    },
                }}
                eventHandlers={
                    new Map([
                        [
                            "loaded",
                            function () {
                                console.log("Report loaded");
                            },
                        ],
                        [
                            "rendered",
                            function () {
                                console.log("Report rendered");
                            },
                        ],
                        [
                            "error",
                            function (event) {
                                console.log(event.detail);
                            },
                        ],
                        ["visualClicked", () => console.log("visual clicked")],
                        ["pageChanged", (event) => console.log(event)],
                    ])
                }
                cssClassName={"Embed-container"}
                getEmbeddedComponent={(embeddedReport) => {
                    window.report = embeddedReport;
                }}
            />
        </>
    );
};

export default Dashboard;