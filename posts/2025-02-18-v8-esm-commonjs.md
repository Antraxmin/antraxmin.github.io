---
title: "V8 엔진은 ESM과 CommonJS를 어떻게 실행할까?"
subtitle: "."
date: '2025-02-18'
category: V8
thumbnail: "https://github.com/user-attachments/assets/0eb8b922-be58-4fb0-a068-a49d72465c6c"
---

JavaScript의 모듈 시스템은 개발자들이 효율적으로 코드를 재사용하고 관리할 수 있도록 돕는 핵심 기능 중 하나이다. 현재는 **CommonJS**와 **ESM**이라는 두 가지 주요 모듈 시스템이 존재한다.

CommonJS는 Node.js에서 기본적으로 사용되는 방식으로, `require()`를 통해 동기적으로 모듈을 로드하고 실행하는 방식을 따른다. 반면 ESM은 최신 JavaScript 표준에서 채택한 방식으로, `import` 문을 통해 모듈을 정적으로 분석하고 비동기적으로 로드하는 특징을 가진다.

하지만 실제로 ESM과 CommonJS가 내부적으로 어떻게 동작하는지, V8 엔진이 이를 해석하고 실행하는 과정에서 어떤 차이가 발생하는지는 많은 개발자들이 정확히 이해하지 못하는 경우가 많다. 특히 성능적인 차이가 발생하는 이유와 각각의 모듈 시스템이 V8 엔진 내부에서 어떤 최적화 과정을 거치는지는 깊이 있는 분석이 필요하다.

이번 글에서는 V8 엔진이 JavaScript 모듈을 실행하는 방식을 중점적으로 분석하며, CommonJS와 ESM이 어떻게 해석되고 실행되는지 비교하고, 실제 성능 실험을 통해 차이를 검증해보려고 한다.

## ESM (import) 처리 과정
ESM(ECMAScript Modules)은 기존 CommonJS보다 더 최적화된 방식으로 모듈을 로드하고 실행할 수 있도록 설계되었다. 특히 정적 분석과 비동기적 파일 로딩을 지원하여 성능을 극대화하며, 바이트코드 변환 과정에서도 추가적인 최적화를 적용한다.

### 정적 분석 (Static Analysis)
ESM의 가장 큰 특징 중 하나는 정적 분석이 가능하다는 점이다.

즉 JavaScript 엔진(V8)은 코드를 실행하기 전에 import 문을 파싱하여 모든 의존성을 미리 분석한다. 이 과정에서 엔진은 다음과 같은 최적화를 수행할 수 있다.

- 모든 import 문을 탐색하여 코드 전체의 의존성을 분석
- 사용되지 않는 모듈을 실행 전 제거하여 최적화(트리 셰이킹)
- 런타임 오류 사전 감지
- 실행 전에 최적화된 바이트코드를 생성하여 실행 속도 향상

정적 분석이 이루어지는 과정은 다음과 같다.

### 소스 코드 파싱 및 모듈 그래프 구축
예를 들어 아래 코드를 실행한다고 가정해보자.

```js
// main.js
import { greet } from "./moduleA.js";
console.log(greet());
```

V8 엔진은 import 문을 만나면 실행하기 전에 `moduleA.js` 의 내용을 미리 분석하고 의존성을 해결한다. 이 과정에서 모듈 의존성 그래프가 구축된다.

```js
// moduleA.js
import { helper } from "./moduleB.js";
export function greet() {
  return helper() + " ESM!";
}
```
이때 V8 엔진이 내부적으로 구축하는 모듈 의존성 그래프는 다음과 같은 형태를 가진다.

```
main.js  
 ├── moduleA.js  
 │   ├── moduleB.js  
```
즉 `main.js` 가 `moduleA.js` 를 가져오고 `moduleA.js` 는 다시 `moduleB.js` 를 가져오는 구조이다. 

모든 import 문이 해결된 후에 실행이 가능하며, 실행이 시작되기 전까지 ESM의 모든 import가 메모리에 로드되어 있어야 한다. 이것이 CommonJS와 가장 큰 차이점 중 하나이다.

### 트리 셰이킹과 정적 분석의 관계
정적 분석이 가능하다는 점 덕분에 ESM은 사용되지 않는 코드(Dead Code)를 제거할 수 있다.

```js
// utils.js
export function usedFunction() { return "Used!"; }
export function unusedFunction() { return "Unused!"; }

// main.js
import { usedFunction } from "./utils.js";
console.log(usedFunction());
```

위 코드에서 `unusedFunction()` 은 전혀 사용되지 않는다. 따라서 ESM은 실행 전에 이를 감지하여 해당 코드를 아예 포함시키지 않는다. 반면 CommonJS는 실행 시점까지 어떤 코드가 사용될지 알 수 없기 때문에 이런 최적화가 불가능하다.

이 차이로 인해 ESM은 실행 전 모듈 그래프를 구성할 수 있으며 실행 속도를 더 최적화할 수 있다.

## ESM과 CommonJS의 실행 방식 차이
CommonJS는 `require()` 를 사용하여 동기적으로 모듈을 로드하고 실행한다. 즉 모듈을 실행할 때마다 즉시 파싱하고 실행해야 하며, 실행 시점에서 모듈이 어떻게 동작할지를 결정한다.

반면 ESM은 실행 전에 모든 import가 해결된 후 실행된다. 이 방식 덕분에 실행 도중에 불필요한 추가 연산을 수행하지 않고도 즉시 실행이 가능하다.

차이를 이해하기 위해 CommonJS와 ESM이 **순환 참조(Circular Dependency)** 를 처리하는 방식을 비교해보자.

### 순환 참조 해결 방식의 차이
CommonJS에서는 `require()` 가 런타임에서 동적으로 실행되므로 순환 참조가 발생해도 실행 흐름을 따라가며 해결할 수 있다. 반면 ESM에서는 실행 전에 모든 import 문이 정적으로 해결되어야 하기 때문에 순환 참조가 감지되면 실행 자체가 불가능하다.

예를 들어 CommonJS에서 순환 참조가 발생하는 코드를 보자.

```js
// a.js
console.log("A 실행됨");
const b = require("./b");
console.log("A의 b 값:", b);
module.exports = "A 완료";

// b.js
console.log("B 실행됨");
const a = require("./a");
console.log("B의 a 값:", a);
module.exports = "B 완료";
```

이 코드를 실행하면 다음과 같은 결과가 출력된다.

```
A 실행됨
B 실행됨
A의 b 값: {}  // 아직 b가 완전히 실행되지 않은 상태
B의 a 값: A 완료
```

`a.js` 가 `b.js` 를 로드하면서 다시 `a.js` 를 로드해야 하지만 CommonJS에서는 실행 흐름을 따라가면서 모듈을 불완전한 상태로라도 반환할 수 있기 때문에 실행이 가능하다.

반면 ESM에서는 실행 전에 모든 모듈을 정적으로 분석해야 하기 때문에 순환 참조가 발생하면 실행 자체가 불가능하다. 실행 도중 오류를 발견하는 것이 아니라 **실행 전에 미리 감지하고 실행을 막는다.**

즉 CommonJS에서는 실행 시점에 따라 미완성된 객체가 반환될 수도 있지만 ESM에서는 **실행 전에 모든 import가 해결되지 않으면 실행 자체가 불가능하다.**

## 정리 
이번 글에서는 V8 엔진이 ESM과 CommonJS를 실행하는 방식의 차이를 분석했다. 

정리하자면 ESM은 정적 분석이 가능하고 트리 셰이킹을 지원하여 더욱 최적화된 실행 환경을 제공한다. 반면 CommonJS는 동기적 로딩 방식으로 실행되며 런타임에서 동적으로 모듈을 로드하는 구조를 가진다.  

따라서 **성능 최적화와 모듈 관리가 중요한 프로젝트라면 ESM을 적극적으로 고려하는 것이 바람직하다**. 앞으로 JavaScript 및 Node.js 생태계에서도 ESM의 활용이 더욱 증가할 것으로 예상되므로 기존 CommonJS 환경을 사용하고 있다면 ESM으로의 전환을 검토해보는 것이 좋을 듯하다. 


