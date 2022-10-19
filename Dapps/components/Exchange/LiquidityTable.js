import Image from 'next/image';
import styles from './LiquidityTable.module.css';
import LineChart from './LineChart';
import ToolTip from './ToolTip';
import { useEffect, useState } from 'react';

const LiquidityTable = (props) => {
  const [horverLoc, setHoverLoc] = useState(null);
  const [activePoint, setActivePoint] = useState(null);
  const [tableWidth, setTableWidth] = useState(350);
  const [svgWidth, setSvgWidth] = useState(5700);
  const [svgHeight, setSvgHeight] = useState(350);

  const [widowSize, setWindowSize] = useState();
  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  };
  useEffect(() => {
    const windowResizeHandler = () => {
      const size = getWindowSize();
      setWindowSize(size);
    };
    window.addEventListener('resize', windowResizeHandler);
    return () => {
      window.removeEventListener('resize', windowResizeHandler);
    };
  }, []);
  console.log(widowSize);

  useEffect(() => {
    if (innerWidth < 1500 && innerWidth > 1024) {
      setSvgWidth(3.8 * innerWidth); //5700/1500
      setTableWidth(0.46 * innerWidth); //(5700/10+100)/1500
    } else if (innerWidth < 816 && innerWidth > 474) {
      setSvgWidth(6.98 * innerWidth); //5700/816
      setTableWidth(0.85 * innerWidth); //(5700/10+100)/816
    } else if (innerWidth < 475) {
      setSvgWidth(6.98 * innerWidth); //5700/707
      setTableWidth(0.9 * innerWidth); //(5700/10+100)/707
      setSvgHeight(400);
    } else {
      setSvgWidth(5700);
      setTableWidth(670);
    }
  }, [widowSize]);

  const data = [
    { date: '5:16pm', x: 0, y: 100 },
    { date: '6:16pm', x: 1, y: 130 },
    { date: '7:19pm', x: 2, y: 120 },
    { date: '8:19pm', x: 3, y: 110 },
    { date: '9:19pm', x: 4, y: 125 },
    { date: '10:19pm', x: 5, y: 90 },
    { date: '11:19pm', x: 6, y: 113 },
    { date: '12:19pm', x: 7, y: 124 },
    { date: '13:19pm', x: 8, y: 130 },
    { date: '14:19pm', x: 9, y: 150 },
    { date: '15:19pm', x: 10, y: 132 },
    { date: '16:19pm', x: 11, y: 156 },
    { date: '17:19pm', x: 12, y: 176 },
    { date: '18:19pm', x: 13, y: 144 },
    { date: '19:19pm', x: 14, y: 157 },
    { date: '20:19pm', x: 15, y: 177 },
    { date: '21:19pm', x: 16, y: 180 },
    { date: '22:19pm', x: 17, y: 175 },
    { date: '23:19pm', x: 18, y: 190 },
    { date: '0:19pm', x: 19, y: 170 },
    { date: '1:19pm', x: 20, y: 200 },
    { date: '2:19pm', x: 21, y: 188 },
    { date: '3:19pm', x: 22, y: 210 },
    { date: '4:19pm', x: 23, y: 190 },
  ];

  const handleChartHover = (_hoverLoc, _activePoint) => {
    setHoverLoc(_hoverLoc);
    setActivePoint(_activePoint);
  };
  return (
    <div className={styles.section_table}>
      <div className={styles.table} style={{ width: tableWidth }}>
        {/* <img className={styles.img} src='/liquidity.png' /> */}
        <div className={styles.table_lp_title}>Liquidity Pool</div>
        <div className={styles.table_chart}>
          <div>
            <div className={styles.popup}>
              {horverLoc ? (
                <ToolTip horverLoc={horverLoc} activePoint={activePoint} />
              ) : null}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.chart}>
              <LineChart
                data={data}
                onChartHover={handleChartHover}
                svgHeight={svgHeight}
                svgWidth={svgWidth}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityTable;
