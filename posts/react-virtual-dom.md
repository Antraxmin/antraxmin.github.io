---
title: JSX와 가상 DOM의 작동 원리
subtitle: 게시물 부제목
date: '2024-01-27'
category: React
thumbnail: "https://github.com/user-attachments/assets/ac54f719-b93e-44e7-b3aa-32bef0ab6854"
---

## JSX란?
JSX는 자바스크립트 확장 문법으로, HTML과 비슷한 문법을 사용하여 UI 요소를 작성할 수 있게 해준다. JSX를 통해 프론트엔드 개발자는 간편하게 리액트 컴포넌트를 작성할 수 있다. (타입스크립트로 리액트 프로젝트를 구성할 경우 파일의 확장자는 .tsx이다.)

## JSX 작동 원리 

### 트랜스파일링

일반적으로 자바스크립트 코드는 html 태그를 포함할 수 없다. JSX 코드를 자바스크립트 안에서 사용할 수 있게 해주는 것은 바로 `Babel` 과 같은 자바스크립트 컴파일러이다. JSX는 문법적으로 자바스크립트가 아니기 때문에 브라우저에서 직접 실행될 수 없기 때문에 Babel을 이용하여 JSX 코드를 일반적인 자바스크립트 코드로 변환하게 된다. 




```js
const element = <h1>Hello, JSX!</h1>;
```



Babel은 위의 JSX 코드를 아래 `React.createElement` 함수로 변환한다. 이때 React.createElement 함수는 React 엘리먼트를 생성한다. 첫 번째 인자는 엘리먼트의 타입, 두 번째 인자는 속성(props), 세 번째 인자는 자식 엘리먼트이다.



```js
const element = React.createElement('h1', null, 'Hello, JSX!');
```



React.createElement 함수가 호출되면 React는 새로운 가상 DOM 노드를 생성하고, 이를 React 엘리먼트로 감싸 반환한다. 해당 엘리먼트는 가상 DOM에만 존재하며, 실제 DOM에는 아직 반영되지 않은 상태이다. 




## React의 가상 DOM

가상 DOM(Virtual DOM)은 리액트의 핵심 개념 중 하나로, 성능 향상과 효율적인 UI 업데이트를 위해 도입된 개념이다. 

실제 DOM은 웹 페이지의 구조를 표현하는 계층적인 트리 구조로, HTML 문서에 포함된 요소들이 실제로 브라우저에 의해 생성되고 관리된다. 이러한 DOM은 사용자 인터랙션에 의해 변경되고 업데이트되는데, 이때 실제 DOM의 조작은 비용이 많이 드는 작업 중 하나이다. 

리액트는 이러한 실제 DOM 조작의 비용을 최소화하고 성능을 향상시키기 위해 가상 DOM을 도입하였다. 


### 가상 DOM의 개념 
가상 DOM은 실제 DOM의 가벼운 복사본이라고 생각하면 된다. 리액트 엘리먼트의 트리 구조를 메모리 상에 가상으로 구현하며, 이를 통해 리액트는 가상 DOM을 조작하고 변경 사항을 효율적으로 감지할 수 있게 된다. 

React에서는 가상 DOM을 사용하여 실제 DOM에 대한 변경사항을 먼저 가상 DOM에서 비교하고, 변경이 필요한 부분만을 선택적으로 실제 DOM에 적용한다.

JSX로 작성된 컴포넌트가 가상 DOM으로 변환되어 실제 DOM에 렌더링되는 과정은 다음과 같다. 


1. 리액트 앱이 실행되면 컴포넌트 트리를 가상 DOM에 렌더링한다.
2. 사용자 상호 작용 또는 데이터 변경 등으로 인해 상태가 업데이트되면, 리액트는 가상 DOM을 통해 이전 가상 DOM 트리와 현재 가상 DOM 트리를 비교한다.
3. 이전과 현재의 가상 DOM 트리를 비교하여 변경된 부분을 감지한다.
4. 변경된 부분만을 선택적으로 실제 DOM에 업데이트한다.


### 가상 DOM을 업데이트하는 Reconciliation 알고리즘

React가 가상 DOM을 비교하여 변경사항을 찾아내는 알고리즘을 `Reconciliation` 이라고 한다. 이 알고리즘은 최소한의 변경 사항만을 찾아내어 성능을 최적화하는 것을 목표로 한다. 

리액트 컴포넌트 변환 과정을 통해 Reconciliation의 원리를 알아보자. 아래는 createElement 형태의 간단한 JSX 코드이다. 


```js
const createElement = (type, key = null, props = {}) => ({
  type,
  key,
  props,
});
```

Reconciliation 알고리즘의 핵심 함수를 통해 **가상 DOM 트리 내부에서 엘리먼트 간 비교 및 업데이트를 수행하는 원리**를 알아보자. 물론 실제 프로젝트에서는 훨씬 더 복잡한 최적화와 성능 개선이 이루어진다. 


```js
const reconcile = (parent, oldChild, newChild) => {
  if (!oldChild) {
    // 이전 자식이 없는 경우, 현재 노드에 새로운 자식 추가
    parent.appendChild(newChild);
  } else if (!newChild) {
    // 새로운 자식이 없는 경우, 현재 노드에서 이전 자식을 제거
    parent.removeChild(oldChild);
  } else if (oldChild.type !== newChild.type) {
    // 이전 자식과 새로운 자식의 타입이 다른 경우, 이전 자식을 제거하고 새로운 자식을 추가
    parent.replaceChild(newChild, oldChild);
  } else if (oldChild.props.key !== newChild.props.key) {
    // 타입은 같지만 key가 다른 경우, 이전 자식을 제거하고 새로운 자식을 추가
    parent.replaceChild(newChild, oldChild);
  } else {
    // 타입과 key가 동일한 경우, 속성을 비교하여 업데이트
    updateElement(oldChild, newChild);
    
    // 이전 자식 엘리먼트와 새로운 자식 엘리먼트의 자식들을 각각 배열로 가져옴
    const oldChildren = Array.from(oldChild.children);
    const newChildren = Array.from(newChild.children);

    // 이전 자식 엘리먼트의 개수와 새로운 자식 엘리먼트의 개수 중에서 더 큰 값을 선택
    const maxLength = Math.max(oldChildren.length, newChildren.length);
    
    // 재귀적으로 자식 엘리먼트에 대해 Reconciliation 수행
    for (let i = 0; i < maxLength; i++) {
      reconcile(oldChild, oldChildren[i], newChildren[i]);
    }
  }
};
```

위의 함수는 가상 DOM에서 이전 자식(oldChild)과 새로운 자식(newChild) 간의 변경 사항을 찾아내고, 이를 실제 DOM에 반영한다. 

이로써 이전 자식과 새로운 자식 간의 차이를 효율적으로 관리하면서, 필요한 경우에만 실제 DOM을 업데이트할 수 있다. 

<br /> 

가상 DOM의 자식들 간 변경 사항 비교를 수행한 후에는 속성 업데이트가 이루어지게 된다. 아래는 단순히 모든 속성을 새로운 엘리먼트의 속성으로 교체하고 있으나, 상황에 따라 더 복잡한 업데이트 로직을 추가할 수 있다.


```js
const updateElement = (oldElement, newElement) => {
  Object.assign(oldElement.props, newElement.props);
};
```


`Object.assign` 메소드는 첫 번째 인자로 전달된 객체에 다른 객체의 속성을 복사한다. 이렇게 함으로써 oldElement의 속성이 newElement의 속성으로 업데이트되면서, 두 엘리먼트의 속성이 동기화된다. 



좀더 복잡한 예시를 통해 **변경 사항이 발생한 부분만 효율적으로 업데이트**하는 원리를 알 수 있다. 아래는 `className`이 변경되었을 때만 스타일을 업데이트하는 로직이다. 

```js
const updateElement = (oldElement, newElement) => {
  if (oldElement.props.className !== newElement.props.className) {
    oldElement.style = newElement.props.className;
  }

  Object.assign(oldElement.props, newElement.props);
};
```

이를 응용해서 특정 이벤트 발생 시 다른 메시지를 출력하도록 하는 가상 DOM의 원리도 파악할 수 있다. 아래는 업데이트 요소에 특정 속성이 존재할 때 그에 따른 로직을 수행하는 부분을 추가한 코드이다. 

```js
const updateElement = (oldElement, newElement) => {
  if (newElement.props.specialAttribute) {
    // 특정 속성이 존재하면 해당 속성의 값에 따라 다른 동작을 수행
    const specialValue = newElement.props.specialAttribute;

    if (specialValue === 'actionA') {
      console.log('A 이벤트 발생');
    } else if (specialValue === 'actionB') {
      console.log('B 이벤트 발생');
    } else {
      console.log('기타 이벤트 발생');
    }
  }

  // 다른 속성들은 일반적인 방식으로 업데이트
  Object.assign(oldElement.props, newElement.props);
};
```


`newElement` 에 특정 속성이 존재하는지 확인한 후 `specialValue` 의 값에 따라서 원하는 동작을 추가하면 된다. 

업데이트된 가상 DOM 트리를 실제 DOM 트리에 적용하는 원리는 다음과 같다. 


```js
const oldTree = createElement('div', null, { key: '1', className: 'old' });
const newTree = createElement('div', null, { key: '1', className: 'updated' });

const parentElement = document.getElementById('app');
reconcile(parentElement, null, oldTree);
reconcile(parentElement, oldTree, newTree);
```

React 컴포넌트가 생성된 후 실제 DOM 요소 선택이 필요하며, `getElementById` 등의 메소드를 사용하여 특정 DOM 엘리먼트에 접근하거나 조작할 수 있다. 여기서는 실제 DOM 요소 중 app 이라는 ID를 가진 엘리먼트를 찾아 반환한다. 

document.getElementById('app')로 찾은 엘리먼트가 React 컴포넌트의 루트 엘리먼트인 경우, React는 해당 엘리먼트 내에 가상 DOM을 렌더링하게 된다. 

## 정리
React 애플리케이션에서는 자바스크립트 코드로 작성된 컴포넌트가 실제 DOM에 렌더링되기 전에 먼저 가상 DOM에 렌더링된다. 그리고 나서 가상 DOM의 변경사항을 감지하여 실제 DOM에 최소한의 변경만을 적용하게 되는 것이다. 

따라서 document.getElementById('app')로 찾은 엘리먼트에 React 컴포넌트의 루트 엘리먼트가 마운트되면, 이 엘리먼트 내에는 React의 가상 DOM이 구성되어 UI를 표현하게 된다. 이 가상 DOM은 React의 엘리먼트 트리를 나타내며, React는 이를 사용하여 UI를 업데이트하고 효율적으로 렌더링한다. 

