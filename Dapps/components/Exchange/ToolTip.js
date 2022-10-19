import styles from './ToolTip.module.css';
import a_styles from './LineChart.module.css';
const ToolTip = (props) => {
  const svgLocation = document
    .getElementsByClassName(a_styles.linechart)[0]
    .getBoundingClientRect();
  let placementStyles = {};
  let width = 100;
  placementStyles.width = width + 'px';
  placementStyles.left = props.horverLoc + svgLocation.left - width / 2;
  console.log(placementStyles);

  return (
    <div className={styles.hover} style={placementStyles}>
      <div className={styles.date}>{props.activePoint.d}</div>
      <div className={styles.price}>{props.activePoint.p}</div>
    </div>
  );
};

export default ToolTip;
