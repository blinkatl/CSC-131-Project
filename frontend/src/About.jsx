import React from 'react';

function About() {

    const teamMembers = [
        {
            name: "Nguyen Ho",
            skills: [
              { type: "Education", detail: "Majoring in Computer Science" },
              { type: "Technical Skills", detail: "Knows Java, Python, R, SQL, and C" },
              { type: "Awards", detail: "Deans List and Honors Program recipient"},
              { type: "Work Experience", detail: "Data Science Researcher at Purdue", detail2: "Catering Lead at Sacremento State", detail3: "Hackaton Leader" },
            ],
          },
        {
          name: "Ivan Lin",
          skills: [
            { type: "Education", detail: "Majoring in Computer Science"},
            { type: "Technical Skills", detail: "Knows Java, C, C++, and some SQL" },
          ],
        },
        {
          name: "Daniel Balolong",
          skills: [
            { type: "Education", detail: "Majoring in Computer Science" },
            { type: "Technical Skills", detail: "Git, Javascript, Java, C++, PostgreSQL, Nodejs, Express, React" },
          ],
        },
        {
            name: "Bao Truong",
            skills: [
              { type: "Education", detail: "Majoring in Computer Science with emphasis on software systems"},
              { type: "Technical Skills", detail: "Knows Java", detail2: "Learning about Data Privacy and User Data Protection"},
            ],
        },
        {
          name: "Samuel Worchester",
          skills: [
            { type: "Education", detail: "Majoring in Computer Science" },
            { type: "Technical Skills", detail: "Knows Java, C, C++, and Linux" },
          ],
        },
        {
          name: "Griffin Johnson",
          skills: [
            { type: "Education", detail: "Majoring in Computer Science", detail2: "Has an Associates in Computer Science from Folsom" },
            { type: "Technical Skills", detail: "Knows C++ and some Java and C" },
          ],
        },
        {
          name: "Richard Chao",
          skills: [
            { type: "Education", detail: "Majoring in Computer Science" },
            { type: "Technical Skills", detail: "Knows Java, bit of Python and Javascript" },
          ],
        },
        {
          name: "Michael Nguyen",
          skills: [
            { type: "Education", detail: "Majoring in Computer Science" },
          ],
        }
      ];
    
      const styles = {
        page: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          backgroundColor: '#1a1a1a',
          color: 'white',
          padding: '20px'
        },
        container: {
          maxWidth: '800px',
          width: '100%',
          padding: '30px',
          border: '1px solid #333',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
          backgroundColor: '#2c2c2c'
        },
        heading: {
          textAlign: 'center',
          color: 'white',
          marginBottom: '30px',
          fontSize: '32px'
        },
        card: {
          backgroundColor: '#3a3a3a',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        },
        name: {
          fontSize: '24px',
          fontWeight: 'bold',
          marginTop: '-10px',
          marginBottom: '15px'
        },
        aboutItem: {
          marginBottom: '10px',
          textAlign: 'left'
        },
        itemSkillType: {
          fontSize: '20px',
          color: 'skyblue'
        },
        itemDetail: {
          fontSize: '16px',
          color: 'white'
        }
      };
    
      const AboutItem = ({ item }) => (
        <div style={styles.aboutItem}>
          <div style={styles.itemSkillType}>{item.type}</div>
          <div style={styles.itemDetail}>{item.detail}<br/>{item.detail2}<br/>{item.detail3}</div>
        </div>
      );
    
      return (
        <div style={styles.page}>
          <form style={styles.container}>
            <h1 style={styles.heading}>About Page</h1>
            {teamMembers.map((member, index) => (
              <div key={index} style={styles.card}>
                <h2 style={styles.name}>{member.name}</h2>
                <div>
                  {member.skills.map((item, idx) => (
                    <AboutItem key={idx} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </form>
        </div>
      );
}

export default About;