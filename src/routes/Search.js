//Modules
import React from "react";
import request from "request";

//.css Files
import "./reset.css";
import "./Search.css";

//Components
import MapContainer from "../components/MapContainer";
import Weather from "../components/Weather";
import Foodlist from "../components/Foodlist";
import FoodButtons from "../components/FoodButtons";
import Sidebar from "../components/Sidebar";

//images
import mapmarker1 from "../img/mapmarker_1.png";
import mapmarker2 from "../img/mapmarker_2.png";
import mapmarker3 from "../img/mapmarker_3.png";
import mapmarker4 from "../img/mapmarker_4.png";
import mapmarker5 from "../img/mapmarker_5.png";

require("dotenv").config();

var headers = {
  Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
};
//${process.env.REST_API_KEY}
const { kakao } = window;

var map;
var nowlat, nowlon;
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

const imageSize = new kakao.maps.Size(50, 50); // 마커이미지의 크기입니다

var markerInd = 0;
//var markerImage = new kakao.maps.MarkerImage(imageSrc[0], imageSize);

var markers = {}; //markers["메뉴이름"] = [마커1,마커2, ...]
var buttonInd = [];

class Search extends React.Component {
  constructor(props) {
    super(props);
    console.log("props : ", props.location.state);
    // console.log("props : ", props.location.state.placename);
    this.state = {
      isLoading: false,
      lat: 37.506502,
      lon: 127.053617,
      menus: ["...", "...", "...", "...", "..."],
      weather: 1,
      weatherStatement: "이번 ",
      season: this.getSeason(),
      imageSrc: [mapmarker1, mapmarker2, mapmarker3, mapmarker4, mapmarker5],
      buttonIndex: [], //버튼 색깔 마커 색깔 일치시키기 위함
      sidebarInfo: {},
    };
    this.getLocation = this.getLocation.bind(this);
    this.getMap = this.getMap.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.decodeWeather = this.decodeWeather.bind(this);
    this.getSeason = this.getSeason.bind(this);
    this.callFoodDB = this.callFoodDB.bind(this);
    this.placesSearchCB = this.placesSearchCB.bind(this);
    this.displayMarker = this.displayMarker.bind(this);
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
        statement = "눈 오는 ";
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
    //console.log("넘어온 props : ", this.props.location.state);
    //const {placename} = this.props.location.state;
    if (this.props.location.state == undefined) {
      // 현재 위치 받아와야
      if (navigator.geolocation) {
        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function (position) {
          nowlat = position.coords.latitude; // 위도
          nowlon = position.coords.longitude; // 경도
          console.log(nowlat, nowlon);
          callback();
        });
      } else {
        // HTML5의 GeoLocation을 사용할 수 없을때, 사용자가 위치정보 거부했을 땐
        nowlat = 37.506502; // 위도
        nowlon = 127.053617; // 경도

        callback();
      }
    } else {
      var places = new kakao.maps.services.Places();
      var callback2 = function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          var step,
            latSum = 0,
            lonSum = 0; // 15개의 좌표를 평균내어 검색하자
          for (step = 0; step < 15; step++) {
            latSum += parseFloat(result[step].y);
            lonSum += parseFloat(result[step].x);
          }
          latSum = String(latSum / 15);
          lonSum = String(lonSum / 15);
          console.log("구한 좌표 : ", latSum, lonSum);
          nowlat = latSum;
          nowlon = lonSum;
          callback();
        } else {
          console.log("search에서 error");
        }
      };
      places.keywordSearch(this.props.location.state.placename, callback2);
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
      kakao.maps.event.addListener(map, "click", function (mouseEvent) {
        infowindow.close();
      });
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
            this.setState({
              weather: weatherData,
              weatherStatement: statement,
            });
            return weatherData;
          })
          .then((weather) => {
            this.callFoodDB(weather);
          });
      });
    });
  };

  callFoodDB = (weather) => {
    //장소 객체 생성
    var ps = new kakao.maps.services.Places();
    console.log("넘어온 데이터는 : ", weather);
    var rainy = 0;
    if (weather) rainy = 1;
    // 맑을 경우 디비 호출
    fetch(`http://localhost:3001/database${rainy}`, {
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
          menus: [
            json[0].menu,
            json[1].menu,
            json[2].menu,
            json[3].menu,
            json[4].menu,
          ],
        });

        for (var i = 0; i < json.length; i++) {
          var options = {
            url: `https://dapi.kakao.com/v2/local/search/keyword.json?y=${nowlat}&x=${nowlon}&radius=1000&query=${json[i].menu}`,
            headers: headers,
          };

          request(options, this.placesSearchCB);
        }
      });
  };

  // 키워드 검색 완료 시 호출되는 콜백함수 입니다
  placesSearchCB = (error, response, body) => {
    const { imageSrc } = this.state;
    if (!error && response.statusCode == 200) {
      const { documents } = JSON.parse(body);
      const menuname = JSON.parse(body).meta.same_name.keyword;
      buttonInd.push(menuname);
      if (markerInd == 4) {
        this.setState({
          buttonIndex: buttonInd,
        });
      }
      if (documents.length) {
        console.log(`${menuname} 검색결과`, documents);
        const markerImage = new kakao.maps.MarkerImage(
          imageSrc[markerInd],
          imageSize
        );
        for (let i = 0; i < documents.length; i++) {
          this.displayMarker(documents[i], markerImage, menuname);
        }
      } else {
        console.log(`${menuname} 검색 결과가 없습니다`);
        if (document.getElementById(menuname))
          document.getElementById(menuname).classList.add("switchoff");
      }
    }
    //검색 결과가 없는 메뉴의 경우 버튼 끄기
    else {
      console.log("카카오 REST API 실패");
    }
    markerInd++;
    //음식별로 마커 색깔 다르게 하기 위해서 image 인덱스 조절
  };

  // 지도에 마커를 표시하는 함수입니다
  displayMarker = (place, markerImage, menuname) => {
    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(place.y, place.x),
      image: markerImage,
    });
    //마커 음식이름별 dictionary로 저장
    if (markers[menuname]) {
      markers[menuname].push(marker);
    } else {
      markers[menuname] = [marker];
    }
    kakao.maps.event.addListener(marker, "click", () => {
      document.getElementById("sidebar").classList.add("show");
      document.getElementById("main").classList.add("marker-clicked");
      //Sidebar Info 수정
      this.setState({
        sidebarInfo: {
          id: place.id,
          place_name: place.place_name,
          address: place.address_name,
          distance: place.distance,
          phone: place.phone,
          place_url: place.place_url,
        },
      });
      // 마커에 클릭이벤트를 등록합니다
      infowindow.setContent(
        `<div style="font-size:12px; justify-content: center; width:fit-content">
          <a href="${place.place_url}" target="_blank">${
          place.place_name
        }</a><br>
          
          <div style="display: inline-block;">
            <a href="${
              "http://map.naver.com/index.nhn?elng=" +
              place.x +
              "&elat=" +
              place.y +
              "&etext=" +
              place.place_name +
              "&pathType=1"
            }" target="_blank"
               style="color:green; text-decoration:underline; text-align:center">${"길찾기"}</a>
            <a id="send-to-btn" href="#" onclick="sendTo('${
              place.place_name
            }', '${
          place.address_name
        }')" style="color:blue; text-decoration:underline; text-align:center">
              나에게 카카오톡
            </a>
          </div>
        </div>
        `
      );
      infowindow.open(map, marker);
    });
  };
  buttonClickEventHandler = (e) => {
    e.preventDefault();
    infowindow.close();
    const target = e.target;
    const foodname = target.innerHTML;
    const selectedMarker = markers[foodname];
    if (selectedMarker) {
      if (selectedMarker[0].getVisible()) {
        target.classList.add("switchoff");
        for (var i = 0; i < selectedMarker.length; i++) {
          selectedMarker[i].setVisible(false);
        }
      } else {
        target.classList.remove("switchoff");
        for (var i = 0; i < selectedMarker.length; i++) {
          selectedMarker[i].setVisible(true);
        }
      }
    } else {
      console.log("해당 음식점 마커 없음");
    }
  };
  componentDidMount() {
    this.getMap();
  }
  componentDidUpdate() {
    //console.log("UPDATE!!")
  }
  render() {
    const {
      sidebarInfo,
      weatherStatement,
      season,
      menus,
      lat,
      lon,
      buttonIndex,
    } = this.state;
    return (
      <div className="container">
        <div className="top">
          <div className="back">
            <i class="orange large angle left icon"></i>
            <a className="backtitle" href="/">
              이전
            </a>
          </div>
        </div>
        <div>
          <header className="title2">
            <Weather season={season} weatherStatement={weatherStatement} />
          </header>
        </div>
        <div className="food-list">
          {menus.map((menu) => (
            <Foodlist foodname={menu} />
          ))}
          <p className="howabout">어떠세요?</p>
        </div>
        <div className="map-container">
          <div id="main" className="main">
            <div className="contents">
              <div className="buttons-container">
                {menus.map((menu) => (
                  <FoodButtons
                    foodname={menu}
                    buttonClickEventHandler={this.buttonClickEventHandler}
                    buttonIndex={buttonIndex}
                  />
                ))}
              </div>

              <div className="map_wrap">
                <MapContainer menus={menus} lat={lat} lon={lon} />
              </div>
            </div>
            <div id="sidebar" className="sidebar">
              <Sidebar sidebarInfo={sidebarInfo} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Search;
