import React from "react";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";

const iconSets = { ...FaIcons, ...SiIcons };

const DynamicIcon = ({ name, ...props }) => {
  const IconComponent = iconSets[name];

  if (!IconComponent) {
    // Return a default icon or null if the name is not found
    return <FaIcons.FaQuestionCircle {...props} />;
  }

  return <IconComponent {...props} />;
};

export default DynamicIcon;
