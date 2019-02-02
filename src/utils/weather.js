export const getChartData = (data) => {
  let dates = []
  let maxTmpArr = []
  let minTmpArr = []

  if (data && data.length) {
    data.map(({ time, max_degree: maxTmp, min_degree: minTmp }) => {
      dates.push(time)
      maxTmpArr.push(maxTmp)
      minTmpArr.push(minTmp)
    })
  }

  return {
    dates,
    maxTmpArr,
    minTmpArr
  }
}

export const getChartConfig = (data) => {
  data = getChartData(data)
  return {
    backgroundColor: 'transparent',
    color: ['#FFB74D', '#4FC3F7'],
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    title: {
      text: '',
      left: 'center'
    },
    grid: {
      left: '5%',
      right: '5%',
      containLabel: false
    },
    lengend: {
      data: ['最高温度', '最低温度'],
      left: 'center',
      backgroundColor: 'red',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.time,
      show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      show: false
    },
    series: [{
      name: '最高温度',
      type: 'line',
      smooth: true,
      data: data.maxTmpArr,
      label: {
        normal: {
          show: true,
          position: 'top',
          formatter:'{c}°C'
        }
      }
    }, {
      name: '最低温度',
      type: 'line',
      smooth: true,
      data: data.minTmpArr,
      label: {
        normal: {
          show: true,
          position: 'bottom',
          formatter:'{c}°C'
        }
      }
    }]
  }
}

