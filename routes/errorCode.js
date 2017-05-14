
/**
 200(성공): 서버가 요청을 제대로 처리했다는 뜻이다. 이는 주로 서버가 요청한 페이지를 제공했다는 의미로 쓰인다.
 201(작성됨): 성공적으로 요청되었으며 서버가 새 리소스를 작성했다.
 202(허용됨): 서버가 요청을 접수했지만 아직 처리하지 않았다.
 203(신뢰할 수 없는 정보): 서버가 요청을 성공적으로 처리했지만 다른 소스에서 수신된 정보를 제공하고 있다.
 204(콘텐츠 없음): 서버가 요청을 성공적으로 처리했지만 콘텐츠를 제공하지 않는다.
 205(콘텐츠 재설정): 서버가 요청을 성공적으로 처리했지만 콘텐츠를 표시하지 않는다. 204 응답과 달리 이 응답은 요청자가 문서 보기를 재설정할 것을 요구한다(예: 새 입력을 위한 양식 비우기).
 206(일부 콘텐츠): 서버가 GET 요청의 일부만 성공적으로 처리했다.

 400(잘못된 요청): 서버가 요청의 구문을 인식하지 못했다.
 401(권한 없음): 이 요청은 인증이 필요하다. 서버는 로그인이 필요한 페이지에 대해 이 요청을 제공할 수 있다.
 403(금지됨): 서버가 요청을 거부하고 있다.
 404(찾을 수 없음): 서버가 요청한 페이지를 찾을 수 없다. 예를 들어 서버에 존재하지 않는 페이지에 대한 요청이 있을 경우 서버는 이 코드를 제공한다.
 405(허용되지 않는 방법): 요청에 지정된 방법을 사용할 수 없다.
 406(허용되지 않음): 요청한 페이지가 요청한 콘텐츠 특성으로 응답할 수 없다.
 407(프록시 인증 필요): 이 상태 코드는 401(권한 없음)과 비슷하지만 요청자가 프록시를 사용하여 인증해야 한다. 서버가 이 응답을 표시하면 요청자가 사용할 프록시를 가리키는 것이기도 한다.
 408(요청 시간초과): 서버의 요청 대기가 시간을 초과하였다.
 409(충돌): 서버가 요청을 수행하는 중에 충돌이 발생했다. 서버는 응답할 때 충돌에 대한 정보를 포함해야 한다. 서버는 PUT 요청과 충돌하는 PUT 요청에 대한 응답으로 이 코드를 요청 간 차이점 목록과 함께 표시해야 한다.
 410(사라짐): 서버는 요청한 리소스가 영구적으로 삭제되었을 때 이 응답을 표시한다. 404(찾을 수 없음) 코드와 비슷하며 이전에 있었지만 더 이상 존재하지 않는 리소스에 대해 404 대신 사용하기도 한다. 리소스가 영구적으로 이동된 경우 301을 사용하여 리소스의 새 위치를 지정해야 한다.
 411(길이 필요): 서버는 유효한 콘텐츠 길이 헤더 입력란 없이는 요청을 수락하지 않는다.
 412(사전조건 실패): 서버가 요청자가 요청 시 부과한 사전조건을 만족하지 않는다.
 413(요청 속성이 너무 큼): 요청이 너무 커서 서버가 처리할 수 없다.
 414(요청 URI가 너무 긺): 요청 URI(일반적으로 URL)가 너무 길어 서버가 처리할 수 없다.
 415(지원되지 않는 미디어 유형): 요청이 요청한 페이지에서 지원하지 않는 형식으로 되어 있다.
 416(처리할 수 없는 요청범위): 요청이 페이지에서 처리할 수 없는 범위에 해당되는 경우 서버는 이 상태 코드를 표시한다.

 500(내부 서버 오류): 서버에 오류가 발생하여 요청을 수행할 수 없다.
 501(구현되지 않음): 서버에 요청을 수행할 수 있는 기능이 없다. 예를 들어 서버가 요청 메소드를 인식하지 못할 때 이 코드를 표시한다.
 502(불량 게이트웨이): 서버가 게이트웨이나 프록시 역할을 하고 있거나 또는 업스트림 서버에서 잘못된 응답을 받았다.
 503(서비스를 사용할 수 없음): 서버가 오버로드되었거나 유지관리를 위해 다운되었기 때문에 현재 서버를 사용할 수 없다. 이는 대개 일시적인 상태이다.
 504(게이트웨이 시간초과): 서버가 게이트웨이나 프록시 역할을 하고 있거나 또는 업스트림 서버에서 제때 요청을 받지 못했다.
 505(HTTP 버전이 지원되지 않음): 서버가 요청에 사용된 HTTP 프로토콜 버전을 지원하지 않는다.
 */

module.exports = {
  "400": {
    "status": 400,
    "msg": {
      "내용" : "잘못된 요청입니다.",
      "description": "Bad Request"
    }
  },

  "401": {
    "status": 401,
    "msg": {
      "내용" : "토큰 인증에 실패하였습니다.",
      "description": "False token"
    }
  },

  "404": {
    "status": 404,
    "msg": {
      "내용" : "잘못된 주소입니다.",
      "description": "Bad Request"
    }
  },

  "500": {
    "status": 500,
    "msg": {
      "내용" : "내부 서버 오류",
      "description": "Internal Server Error"
    }
  },

  "9400": {
    "status": 400,
    "msg": {
      "내용" : "잘못된 코드입니다.",
      "description": "invalid parameter"
    }
  },

  "9404": {
    "status" : 200,
    "msg" : []
  },

  "9500": {
    "status": 500,
    "msg": {
      "내용" : "해당 정보가 없습니다.",
      "description": "No have content"
    }
  },

  "1401": {
    "status": 200,
    "msg": {
      "내용" : "아이디가 중복됩니다.",
      "description": "Exist Email"
    }
  }
}