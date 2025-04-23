import React from 'react';
import './Credits.css';

const Credits = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Nguyen Ho",
      role: "Project Manager",
      imageUrl: "/nh.png"
    },
    {
      id: 2,
      name: "Bao Truong",
      role: "Analyst",
      imageUrl: "/api/placeholder/300/300"
    },
    {
      id: 3,
      name: "Griffin Johnson",
      role: "Designer",
      imageUrl: "/gj.png"
    },
    {
      id: 4,
      name: "Samuel Worcester",
      role: "Designer",
      imageUrl: "/api/placeholder/300/300"
    },
    {
      id: 5,
      name: "Daniel Balolong",
      role: "Programmer",
      imageUrl: "/db.png"
    },
    {
      id: 6,
      name: "Ivan Lin",
      role: "Programmer",
      imageUrl: "/il.png"
    },
    {
      id: 7,
      name: "Michael Nguyen",
      role: "Programmer",
      imageUrl: "/api/placeholder/300/300"
    },
    {
      id: 8,
      name: "Richard Chao",
      role: "Quality Control",
      imageUrl: "/api/placeholder/300/300"
    }
  ];

  return (
    <div className="team-container">
      <h1 className="team-heading">Project Delta</h1>
      
      <div className="team-grid">
        {teamMembers.map((member) => (
          <div key={member.id} className="team-member">
            <div className="member-image-container">
              {member.imageUrl && (
                <img 
                  src={member.imageUrl} 
                  alt={`${member.name}'s profile`} 
                  className="member-image"
                />
              )}
            </div>
            <h3 className="member-name">{member.name}</h3>
            <p className="member-role">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;