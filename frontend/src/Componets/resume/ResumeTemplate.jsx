import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Tspan,
} from "@react-pdf/renderer";
import { SERVER_BASE_URL } from "../../constants";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    border: 2,
    borderRadius: 6,
    padding: 3,
    gap: 10,
  },
  imageContainer: {
    width: 90,
    height: 120,
    padding: 2,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  headerTextContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  name: {
    fontSize: 24,
    fontWeight: "semibold",
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "row",
  },
  location: {
    fontSize: 20,
    fontWeight: "medium",
  },
  degree: {
    fontSize: 20,
    fontWeight: "bold",
  },
  role: {
    fontSize: 20,
    fontWeight: "bold",
  },
  contacts: {},
  container: {
    marginTop: 28,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 3,
    borderBottom: 2,
    marginBottom: 3,
  },

  subContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  personalContainer: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    padding: 10,
    gap: 5,
  },
});
const ResumeTemplate = ({ user }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} dpi={80}>
        <View style={styles.header}>
          <View style={styles.imageContainer}>
            <img
              src={`${SERVER_BASE_URL}/uploads/${user._id}.jpg`}
              alt="ph"
              className=" w-full h-full"
            />
            <Image
              src={{
                uri: `${SERVER_BASE_URL}/uploads/${user._id}.jpg`,
                method: "GET",
                headers: { "Cache-Control": "no-cache" },
                body: "",
              }}
              style={styles.image}
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.name}>{user.resume.name}</Text>
            <View style={styles.detailsContainer}>
              <Text>
                <Tspan style={styles.location}>
                  {user.resume.personalDetails.address &&
                    user.resume.personalDetails.address}
                </Tspan>
                {user.email && " | " + user.email}
                {user.mobile && " | " + user.mobile}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.heading}>Education</Text>
          {user.resume.qualifications.map((qualification) => (
            <View style={styles.subContainer}>
              <Text>
                <Tspan
                  style={styles.degree}
                >{`${qualification.degree}: `}</Tspan>
                {`${qualification.institute} | ${qualification.field} | ${qualification.score} | ${qualification.passingYear}`}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.container}>
          <Text style={styles.heading}>Skills</Text>
          <View style={styles.subContainer}>
            <Text>
              {user.resume.skills.map((skill) => (
                <Tspan>{`${skill}, `} </Tspan>
              ))}
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.heading}>Experiences</Text>
          {user.resume.experiences.map((experience) => (
            <View style={styles.subContainer}>
              <Text>
                <Tspan style={styles.role}>{`${experience.role}: `}</Tspan>
                {`${experience.company} | ${experience.location} | ${experience.fromYear}-${experience.toYear}`}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.container}>
          <Text style={styles.heading}>Personal Details</Text>
          <View style={styles.personalContainer}>
            <Text>Fathers Name: {user.resume.personalDetails.fathersName}</Text>
            <Text>Mothers Name: {user.resume.personalDetails.mothersName}</Text>
            <Text>Date of Birth: {user.resume.personalDetails.dob}</Text>
            <Text>Sex: {user.resume.personalDetails.sex}</Text>
            <Text>Blood Group: {user.resume.personalDetails.bloodGroup}</Text>
            <Text>Nationality: {user.resume.personalDetails.nationality}</Text>
            <Text>Religion: {user.resume.personalDetails.religion}</Text>
            <Text>
              Marital Status: {user.resume.personalDetails.maritalStatus}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ResumeTemplate;
