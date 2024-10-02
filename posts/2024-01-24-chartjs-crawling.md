---
title: Chart.js 그래프를 크롤링해보자
subtitle: Selenium에서 JavaScript를 활용해 동적인 데이터 추출하기
date: '2024-01-24'
category: JavaScript
thumbnail: "https://github.com/user-attachments/assets/e6da61b7-0c60-4c60-b0b9-6b31db7364ae"
---

## 서론

외주 작업을 진행하며 규모 있는 마케팅 자동화 시스템을 구축하고 있었다. 회사 측으로부터 정보를 제공받고 해당 업체의 블랙키위 키워드 데이터 크롤링을 진행해야 했다.

마케팅 쪽을 다루는 사람은 아닌지라 블랙키위라는 사이트를 처음 들어가보게 되었는데, 일단 페이지 구조부터 파악하고자 했다.

## 문제 직면

일반적인 사이트 구조랑 비슷한듯 해서 일단 BeautifulSoup4 모듈로 크롤링할 요소를 찾았지만, 대부분의 요소가 CSR(Client-Side Rendering)로 돌아가고 있다는 것을 발견했다.

이에 대응하기 위해 Selenium과 ChromeDriver를 세팅한 다음 XPath로 월간 검색량을 추출했다. 하지만 일간 검색량 추출에서 새로운 문제에 직면했다.

<img width="654" alt="image" src="https://github.com/user-attachments/assets/741513ca-6a1c-4234-9eb4-73f36d63d004">


## Chart.js 그래프 크롤링 도전

일간 검색량이 `Chart.js` 를 이용한 동적 그래프로 표현되어 있었다. 이를 크롤링하기 위해 다음과 같은 접근 방식을 사용했다. 

1. Chart.js를 구성하는 Canvas 요소 찾기
2. Canvas가 브라우저에 그려지는 구조 파악
3. 번들링된 JS 파일 찾아내기

### 1. Canvas 요소 찾기

Canvas 요소는 Chart.js 그래프의 기본 구성 요소이므로, 이를 찾는 것이 첫 번째 단계이다. 

```python
chart_element = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//canvas'))
)
```

 페이지에 여러 개의 Canvas 요소가 있을 경우, 원하는 그래프를 특정하기 어려울 수 있다. 이때는 더 구체적인 `XPATH` 나 `CSS` 선택자를 사용하여 정확한 Canvas 요소를 타겟팅하는 방법밖에 없지 않을까 싶다. 

### 2. Canvas 구조 파악

Canvas 객체의 구조를 파악하기 위해 Selenium Webdriver로 출력해보았다.

```
<selenium.webdriver.remote.webelement.WebElement (session="552b2103fb32a38403fe519f6ce3004a", element="DC6166518845FEA711611893F9618642_element_26")>
```

안타깝게도 Canvas 요소 자체로는 그래프 데이터에 직접 접근할 방법이 없는 것 같았고, Chart.js 인스턴스에 접근하기 위해 JavaScript 실행이 필요했다. 


### 3. 번들링된 JS 파일 분석

~~(여기까지 오고싶진 않았는데..)~~

번들링된 JS 파일에는 Chart.js 인스턴스와 데이터 구조에 대한 정보가 포함되어 있을 것이기 때문에 관련 코드를 뜯어보았다. 

먼저, Chart.js를 사용하는 React 컴포넌트의 구조를 파악했다. 주요 부분은 다음과 같다.

```javascript
<LineChart
  labels={searchTrendProps.labels}
  data={searchTrendProps.data}
  chartColors={searchTrendProps.chartColors}
  dataPrefixes={searchTrendProps.dataPrefixes}
  isShowLegend={Object.keys(compareKeywords).length > 0}
/>
```

이 코드에서 `LineChart` 컴포넌트가 여러 props를 받고 있음을 알 수 있었다. 

- `labels` : X축의 라벨 데이터
- `data` : Y축의 실제 데이터 값
- `chartColors` : 그래프의 색상 정보
- `dataPrefixes` : 데이터 접두사
- `isShowLegend` : 범례 표시 여부

searchTrendProps 객체의 구조를 더 자세히 살펴보았다.

<img width="651" alt="image" src="https://github.com/user-attachments/assets/63f7679f-52e8-4d0a-b4fd-931dd57342e7">

```js
var searchTrendProps = Object(react["useMemo"])(function () {
  if (!searchTrendFlag) return {};
  var data = [searchTrend.map(function (e) {
    return e.searchVolume;
  })];
  var chartColors = [style_theme["a" /* default */].palette.chart[2]];
  var dataPrefixes = [searchKeyword];
  
  if (Object.keys(compareKeywords).length > 0 && Object.keys(compareKeywordsTrendData).length > 0) {
    Object.values(compareKeywordsTrendData).forEach(function (e) {
      data.push(e.map(function (_e) {
        return _e.searchVolume;
      }));
    });
    Object.entries(compareKeywords).forEach(function (_ref2) {
      var _ref3 = SearchTrend_slicedToArray(_ref2, 2),
        _ref3$ = _ref3[1],
        keyword = _ref3$.keyword,
        color = _ref3$.color;
      chartColors.push(color);
      dataPrefixes.push(keyword);
    });
  }
  
  return {
    labels: searchTrend.map(function (e) {
      return e.period;
    }),
    data: data,
    chartColors: chartColors,
    dataPrefixes: dataPrefixes
  };
}, [searchKeyword, searchTrend, compareKeywordsTrendData, searchTrendFlag]);
```
이 코드를 통해 중요한 정보를 얻을 수 있었다. 

1. searchTrend 배열이 주요 데이터 소스이다. 
2. 각 데이터 포인트는 `period` 와 `searchVolume` 속성을 가진다.
3. 비교 키워드가 있는 경우, 추가 데이터 세트가 포함된다.
4. `useMemo` 훅을 사용해 성능 최적화를 하고 있다. 

### 4. 크롤링 전략 수립

이러한 분석을 바탕으로 다음과 같은 크롤링 전략을 세웠다.

1. Selenium을 사용해 페이지를 로드하고 JavaScript 실행이 완료될 때까지 기다린다.
2. `searchTrendProps` 객체에 접근하여 필요한 데이터를 추출한다.
3. 추출한 데이터를 파싱하여 원하는 형태로 가공한다. 

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("https://[주소]")

canvas = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, "//canvas"))
)

chart_data = driver.execute_script("""
    var canvas = document.querySelector('canvas');
    var chart = canvas.__chartjs_instance__;
    return {
        labels: chart.data.labels,
        datasets: chart.data.datasets.map(function(dataset) {
            return {
                label: dataset.label,
                data: dataset.data
            };
        })
    };
""")

print(chart_data)

driver.quit()
```

## 결론

Chart.js로 만들어진 그래프를 크롤링하는 것은 단순한 HTML 파싱으로는 불가능하지만, `Selenium` 과 `JavaScript` 실행을 조합하여 해결할 수 있다. 이 방법을 통해 동적으로 생성되는 차트 데이터를 성공적으로 추출할 수 있었다. ~~(어렵다)~~

이 접근 방식은 Chart.js뿐만 아니라 다른 JavaScript 기반의 차트 라이브러리에도 응용할 수 있어, 웹 크롤링의 범위를 크게 확장시킬 수 있다. 

주의할 점은 마케팅이나 키워드 관련 사이트의 경우 업데이트가 굉장히 빈번하게 일어난다는 것이다. 이렇게 JavaScript 코드가 변경될 경우 크롤링 코드도 그에 맞게 수정해야 한다. 
따라서 장기 프로젝트라면 주기적인 모니터링이 필요할 것 같다. 
