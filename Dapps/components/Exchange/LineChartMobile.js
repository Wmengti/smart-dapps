import styles from './LineChart.module.css';
import { useState } from 'react';

const LineChartMoblie = (props) => {
  const [hoverLoc, setHoverLoc] = useState(null);
  const [activePoint, setActivePoint] = useState(null);
  const {
    data,
    svgHeight,
    svgWidth,
    color,
    pointRadius,
    onChartHover,
    yLabelSize,
    xLabelSize,
  } = props;
  const getX = () => {
    return {
      min: data[0].x,
      max: data[data.length - 1].x,
    };
  };

  const getY = () => {
    return {
      min: data.reduce((min, p) => (p.y < min ? p.y : min), data[0].y),

      max: data.reduce((max, p) => (p.y > max ? p.y : max), data[0].y),
    };
  };
  const getSvgX = (x) => {
    return yLabelSize + (x / getY().max) * (svgWidth - yLabelSize);
  };
  const getSvgY = (y) => {
    const gY = getY();
    return (
      ((svgHeight - xLabelSize) * gY.max - (svgHeight - xLabelSize) * y) /
      (gY.max - gY.min)
    );
  };

  const makePath = () => {
    let pathD = 'M ' + getSvgX(data[0].x) + ' ' + getSvgY(data[0].y) + ' ';

    pathD += data.map((point, i) => {
      return 'L ' + getSvgX(point.x) + ' ' + getSvgY(point.y) + ' ';
    });

    return (
      <path
        className={styles.linechart_path}
        d={pathD}
        style={{ stroke: color }}
      />
    );
  };

  const makeArea = () => {
    let pathD = 'M ' + getSvgX(data[0].x) + ' ' + getSvgY(data[0].y) + ' ';

    pathD += data.map((point, i) => {
      return 'L ' + getSvgX(point.x) + ' ' + getSvgY(point.y) + ' ';
    });
    const x = getX();
    const y = getY();
    pathD +=
      'L ' +
      getSvgX(x.max) +
      ' ' +
      getSvgY(y.min) +
      ' ' +
      'L ' +
      getSvgX(x.min) +
      ' ' +
      getSvgY(y.min) +
      ' ';

    return <path className={styles.linechart_area} d={pathD} />;
  };

  const makeAxis = () => {
    const x = getX();
    const y = getY();

    return (
      <g className={styles.linechart_axis}>
        <line
          x1={getSvgX(x.min) - yLabelSize}
          y1={getSvgY(y.min)}
          x2={getSvgX(x.max)}
          y2={getSvgY(y.min)}
          strokeDasharray='5'
        />
        <line
          x1={getSvgX(x.min) - yLabelSize}
          y1={getSvgY(y.max)}
          x2={getSvgX(x.max)}
          y2={getSvgY(y.max)}
          strokeDasharray='5'
        />
      </g>
    );
  };
  const makeLabels = () => {
    const padding = 5;
    return (
      <g className={styles.linechart_label}>
        {/* Y AXIS LABELS */}
        <text
          transform={`translate(${yLabelSize / 2}, 20)`}
          textAnchor='middle'
        >
          {getY().max}
        </text>
        <text
          transform={`translate(${yLabelSize / 2}, ${
            svgHeight - xLabelSize - padding
          })`}
          textAnchor='middle'
        >
          {getY().min}
        </text>
        {/* X AXIS LABELS */}
        <text
          transform={`translate(${yLabelSize}, ${svgHeight})`}
          textAnchor='start'
        >
          {data[0].date}
        </text>
        <text
          // transform={`translate(${svgWidth + yLabelSize}, ${svgHeight})`}
          transform={`translate(${yLabelSize + 350}, ${svgHeight})`}
          textAnchor='end'
        >
          {data[data.length - 1].date}
        </text>
      </g>
    );
  };
  // FIND CLOSEST POINT TO MOUSE
  const getCoords = (e) => {
    const svgLocation = document
      .getElementsByClassName(styles.linechart)[0]
      .getBoundingClientRect();
    const adjustment = (svgLocation.width - svgWidth) / 2; //takes padding into consideration
    const relativeLoc = e.clientX - svgLocation.left - adjustment;

    let svgData = [];
    data.map((point, i) =>
      svgData.push({
        svgX: getSvgX(point.x),
        svgY: getSvgY(point.y),
        d: point.date,
        p: point.y,
      })
    );

    let closestPoint = {};
    for (let i = 0, c = 500; i < svgData.length; i++) {
      if (Math.abs(svgData[i].svgX - hoverLoc) <= c) {
        c = Math.abs(svgData[i].svgX - hoverLoc);
        closestPoint = svgData[i];
      }
    }

    if (relativeLoc - yLabelSize < 0) {
      stopHover();
    } else {
      console.log('relativeLoc', relativeLoc);
      console.log('closestPoint', closestPoint);
      setHoverLoc(relativeLoc);
      setActivePoint(closestPoint);
      onChartHover(relativeLoc, closestPoint);
    }
  };
  // STOP HOVER
  const stopHover = () => {
    setHoverLoc(null);
    setActivePoint(null);
    onChartHover(null, null);
  };
  // MAKE ACTIVE POINT
  const makeActivePoint = () => {
    return (
      <circle
        className={styles.linechart_point}
        style={{ stroke: color }}
        r={pointRadius}
        cx={activePoint.svgX}
        cy={activePoint.svgY}
      />
    );
  };
  // MAKE HOVER LINE
  const createLine = () => {
    return (
      <line
        className={styles.hoverLine}
        x1={hoverLoc}
        y1={-8}
        x2={hoverLoc}
        y2={svgHeight - xLabelSize}
      />
    );
  };
  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className={styles.linechart}
      onMouseLeave={() => stopHover()}
      onMouseMove={(e) => getCoords(e)}
    >
      <g>
        {makeAxis()}
        {makePath()}
        {makeArea()}
        {makeLabels()}
        {hoverLoc ? createLine() : null}
        {hoverLoc ? makeActivePoint() : null}
      </g>
    </svg>
  );
};

LineChartMoblie.defaultProps = {
  liquidity: [],
  color: '#2196F3',
  pointRadius: 5,
  svgHeight: 250,
  svgWidth: 2800,
  xLabelSize: 10,
  yLabelSize: 20,
};

export default LineChartMoblie;
