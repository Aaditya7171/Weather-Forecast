import React from 'react';

interface WeatherIconProps {
  condition: string;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ condition, className = '' }) => {
  const getIcon = () => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return (
          <svg className={`${className} weather-icon`} viewBox="0 0 100 100">
            <circle className="sun" cx="50" cy="50" r="20" fill="yellow">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
            </circle>
            <g className="rays">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="25"
                  stroke="yellow"
                  strokeWidth="3"
                  transform={`rotate(${angle} 50 50)`}
                >
                  <animate attributeName="y2" values="25;20;25" dur="2s" repeatCount="indefinite" />
                </line>
              ))}
            </g>
          </svg>
        );
      case 'clouds':
        return (
          <svg className={`${className} weather-icon`} viewBox="0 0 100 100">
            <g className="clouds">
              <path
                className="cloud"
                d="M25,60 Q30,50 40,55 Q45,45 55,50 Q65,45 70,55 Q80,50 75,60 Q85,65 75,70 Q65,75 55,70 Q45,75 35,70 Q25,75 25,60"
                fill="white"
              >
                <animate attributeName="d" 
                  values="M25,60 Q30,50 40,55 Q45,45 55,50 Q65,45 70,55 Q80,50 75,60 Q85,65 75,70 Q65,75 55,70 Q45,75 35,70 Q25,75 25,60;
                         M25,62 Q30,52 40,57 Q45,47 55,52 Q65,47 70,57 Q80,52 75,62 Q85,67 75,72 Q65,77 55,72 Q45,77 35,72 Q25,77 25,62;
                         M25,60 Q30,50 40,55 Q45,45 55,50 Q65,45 70,55 Q80,50 75,60 Q85,65 75,70 Q65,75 55,70 Q45,75 35,70 Q25,75 25,60"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </svg>
        );
      case 'rain':
        return (
          <svg className={`${className} weather-icon`} viewBox="0 0 100 100">
            <g className="clouds">
              <path
                className="cloud"
                d="M25,40 Q30,30 40,35 Q45,25 55,30 Q65,25 70,35 Q80,30 75,40 Q85,45 75,50 Q65,55 55,50 Q45,55 35,50 Q25,55 25,40"
                fill="#919191"
              />
            </g>
            <g className="rain-drops">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <line
                  key={i}
                  x1={30 + i * 10}
                  y1="60"
                  x2={30 + i * 10}
                  y2="65"
                  stroke="#4F95FF"
                  strokeWidth="2"
                >
                  <animate
                    attributeName="y1"
                    values="60;90"
                    dur="1s"
                    begin={`${i * 0.2}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="y2"
                    values="65;95"
                    dur="1s"
                    begin={`${i * 0.2}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    dur="1s"
                    begin={`${i * 0.2}s`}
                    repeatCount="indefinite"
                  />
                </line>
              ))}
            </g>
          </svg>
        );
      case 'thunderstorm':
        return (
          <svg className={`${className} weather-icon`} viewBox="0 0 100 100">
            <g className="clouds">
              <path
                className="cloud"
                d="M25,40 Q30,30 40,35 Q45,25 55,30 Q65,25 70,35 Q80,30 75,40 Q85,45 75,50 Q65,55 55,50 Q45,55 35,50 Q25,55 25,40"
                fill="#424242"
              />
            </g>
            <path
              className="lightning"
              d="M55,50 L45,70 L55,70 L45,90"
              stroke="#FFD700"
              strokeWidth="3"
              fill="none"
            >
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        );
      default:
        return (
          <svg className={`${className} weather-icon`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="20" fill="white" />
          </svg>
        );
    }
  };

  return getIcon();
};

export default WeatherIcon;