import React from "react";
import MapContainer from "../components/MapContainer";
import Weather from "../components/Weather";
import Foodlist from "../components/Foodlist";
import "./Search.css";

//images
import mapmarker1 from "../img/mapmarker_1.png";
import mapmarker2 from "../img/mapmarker_2.png";
import mapmarker3 from "../img/mapmarker_3.png";
import mapmarker4 from "../img/mapmarker_4.png";
import mapmarker5 from "../img/mapmarker_5.png";

const { kakao } = window;

var map;
var nowlat, nowlon;
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

const imageSrc = [mapmarker1, mapmarker2, mapmarker3, mapmarker4, mapmarker5],
  imageSize = new kakao.maps.Size(50, 50); // 마커이미지의 크기입니다

var markerInd = 0;
//var markerImage = new kakao.maps.MarkerImage(imageSrc[0], imageSize);

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      lat: 37.506502,
      lon: 127.053617,
      menus: [1, 2, 3, 4, 5],
      weather: 1,
      weatherStatement: "비가 오는 ",
      season: this.getSeason(),
    };
    //console.log("props", props);
    //console.log("state", this.state);
    //console.log("검색장소: ", props.location.state.placename);
    this.getLocation = this.getLocation.bind(this);
    this.getMap = this.getMap.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.decodeWeather = this.decodeWeather.bind(this);
  }

  decodeWeather = (weather) => {
    let statement = "";
    switch (weather) {
      case 0:
        statement = "화창한 ";
        break;
      case 1:
        statement = "비가 오는 ";
        break;
      case 2:
        statement = "진눈개비 오는 ";
        break;
      case 3:
        statement = "눈 오는";
        break;
      case 4:
        statement = "소나기 내리는 ";
        break;
      case 5:
        statement = "빗방울이 떨어지는 ";
        break;
      case 6:
        statement = "비바람이 몰아치는 ";
        break;
      case 7:
        statement = "눈발이 거센 ";
        break;
    }
    return statement;
  };
  
  getSeason() {
    const date = new Date();
    const Month = (date.getMonth() + 1).toString();
    var season = "";
    switch (Month) {
      case "12":
      case "1":
      case "2":
        season = "겨울";
        break;
      case "3":
      case "4":
      case "5":
        season = "봄";
        break;
      case "6":
      case "7":
      case "8":
        season = "여름";
        break;
      case "9":
      case "10":
      case "11":
        season = "가을";
        break;
    }
    return season;
  }

  getLocation = (callback) => {
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(function (position) {
        nowlat = position.coords.latitude; // 위도
        nowlon = position.coords.longitude; // 경도
        console.log(nowlat, nowlon);
        //var locPosition = new kakao.maps.LatLng(nowlat, nowlon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
        //message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다

        // 마커와 인포윈도우를 표시합니다
        //displayMarker(locPosition, message);
        callback();
        //return locPosition;
      });
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때, 사용자가 위치정보 거부했을 땐
      nowlat = 37.506502; // 위도
      nowlon = 127.053617; // 경도커 표시 위치와 인포윈도우 내용을 설정합니다

      //var locPosition = new kakao.maps.LatLng(37.506502, 127.053617);
      //message = "geolocation을 사용할수 없어요..";

      //displayMarker(locPosition, message);
      callback();
    }
  };
  getMap = () => {
    var weatherData = -1;
    this.getLocation(() => {
      this.setState({ lat: nowlat, lon: nowlon });
      let container = document.getElementById("Mymap");
      let options = {
        center: new kakao.maps.LatLng(this.state.lat, this.state.lon),
        level: 5,
      };

      map = new window.kakao.maps.Map(container, options);

      // 장소 검색 객체를 생성합니다
      //console.log(kakao.maps);
      var ps = new kakao.maps.services.Places();

      // 키워드로 장소를 검색합니다

      return new Promise(function (resolve, reject) {
        resolve({ latitude: nowlat, longitude: nowlon });
      }).then((result) => {
        console.log("promise에서 넘어온 데이터 : ", result);
        fetch("http://localhost:3001/weather", {
          // 위도, 경도 정보를 바탕으로 날씨정보 가져옴
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ lat: result.latitude, lon: result.longitude }),
        }) // '날씨' 만 가져와 아래로 넘김
          .then((res) => res.json())
          .then((json) => {
            console.log("클라이언트가 받은 값(날씨)은 : ", json);
            weatherData = json;
            let statement = this.decodeWeather(weatherData);
            this.setState({ weather: weatherData,
            weatherStatement:  statement});
            return weatherData;
          })
          .then((data) => {
            console.log("넘어온 데이터는 : ", data);
            if (data === 0) {
              // 맑을 경우 디비 호출
              fetch(`http://localhost:3001/database0`, {
                method: "post",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(),
              })
                .then((res) => res.json())
                .then((json) => {
                  console.log("출력되는 json : ", json);
                  this.setState({
                    isLoading: false,
                    menus: [
                      json[0].menu,
                      json[1].menu,
                      json[2].menu,
                      json[3].menu,
                      json[4].menu,
                    ],
                  });
                  for (let i = 0; i < 5; i++) {
                    ps.keywordSearch(json[i].menu, this.placesSearchCB, {
                      radius: 1000,
                      location: new kakao.maps.LatLng(nowlat, nowlon),
                    });
                  }
                });
            } else {
              // 비/눈이 올 경우 디비 호출
              fetch(`http://localhost:3001/database1`, {
                method: "post",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(),
              })
                .then((res) => res.json())
                .then((json) => {
                  console.log("출력되는 json : ", json);
                  this.setState({
                    isLoading: false,
                    menus: [
                      json[0].menu,
                      json[1].menu,
                      json[2].menu,
                      json[3].menu,
                      json[4].menu,
                    ],
                  });
                  for (let i = 0; i < 5; i++) {
                    ps.keywordSearch(json[i].menu, this.placesSearchCB, {
                      radius: 1000,
                      location: new kakao.maps.LatLng(nowlat, nowlon),
                    });
                  }
                });
            }
          });
      });
    });
  };
  // 키워드 검색 완료 시 호출되는 콜백함수 입니다
  placesSearchCB = (data, status, pagination) => {
    if (status === kakao.maps.services.Status.OK) {
      const markerImage = new kakao.maps.MarkerImage(
        imageSrc[markerInd],
        imageSize
      );
      //console.log("data", data); //메뉴별 장소목록
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      var bounds = new kakao.maps.LatLngBounds();

      for (var i = 0; i < data.length; i++) {
        this.displayMarker(data[i], markerImage);
        bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
      }
      markerInd++; //음식별로 마커 색깔 다르게 하기 위해서 image 인덱스 조절
      if (markerInd > 4) markerInd = 0;
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      //map.setBounds(bounds);
    }
  };

  // 지도에 마커를 표시하는 함수입니다
  displayMarker = (place, markerImage) => {
    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(place.y, place.x),
      image: markerImage,
    });

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, "click", function () {
      // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
      infowindow.setContent(
        `<div style="padding:5px;font-size:12px;">
        <a href="${place.place_url}" target="_blank">${place.place_name}</a><br>
        <a href="${
          "http://map.naver.com/index.nhn?elng=" +
          place.x +
          "&elat=" +
          place.y +
          "&etext=" +
          place.place_name +
          "&pathType=1"
        }" target="_blank"  style="color:green; text-decoration:underline">${
          place.place_name + "까지 길찾기"
        }</a>
        </div>`
      );
      infowindow.open(map, marker);
    });
  };

  componentDidMount() {
    this.getMap();
  }
  render() {
    const { weatherStatement, season, menus, lat, lon } = this.state;
    return (
      <div>
        <header>
          <Weather season={season} weatherStatement={weatherStatement} />
        </header>
        <div className="food-list">
          {menus.map((menu) => (
            <Foodlist foodname={menu} />
          ))}
          <span className="">은 어떠세요?</span>
        </div>
        <div className="map-container">
          <div className="main">
            <div className="contents">
              <div className="map_wrap">
                <MapContainer menus={menus} lat={lat} lon={lon} />
              </div>
            </div>
            <div className="sidebar">사이드바 영역입니다.</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
