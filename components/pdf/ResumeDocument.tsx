import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts if desired. For now, use built-in standard fonts.
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff' }, // Regular
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff', fontWeight: 600 }, // SemiBold
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333333',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#111111',
  },
  contactInfo: {
    fontSize: 10,
    color: '#555555',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#111111',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingBottom: 3,
  },
  summary: {
    fontSize: 10,
    color: '#444444',
  },
  itemGroup: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#222222',
  },
  itemSubtitle: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#555555',
  },
  itemDate: {
    fontSize: 10,
    color: '#555555',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 10,
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    color: '#444444',
  },
  skills: {
    fontSize: 10,
    color: '#444444',
  }
});

export interface ResumeData {
  fullName: string;
  contactInfo: string;
  professionalSummary: string;
  experience: {
    title: string;
    company: string;
    dateRange: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  skills: string;
}

interface ResumeDocumentProps {
  data: ResumeData;
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header section */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.fullName}</Text>
        <Text style={styles.contactInfo}>{data.contactInfo}</Text>
      </View>

      {/* Professional Summary */}
      {data.professionalSummary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summary}>{data.professionalSummary}</Text>
        </View>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.experience.map((exp, index) => (
            <View key={index} style={styles.itemGroup}>
              <View style={styles.itemHeader}>
                <View>
                  <Text style={styles.itemTitle}>{exp.title}</Text>
                  <Text style={styles.itemSubtitle}>{exp.company}</Text>
                </View>
                <Text style={styles.itemDate}>{exp.dateRange}</Text>
              </View>
              {exp.bullets && exp.bullets.map((bullet, bIndex) => (
                <View key={bIndex} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {data.skills && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.skills}>{data.skills}</Text>
        </View>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={styles.itemGroup}>
              <View style={styles.itemHeader}>
                <View>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                </View>
                <Text style={styles.itemDate}>{edu.year}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

    </Page>
  </Document>
);
