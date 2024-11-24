import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as LocalAuthentication from "expo-local-authentication";

const ClockInScreen = ({ navigation }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false); // 인증 상태

  const handleClockIn = async () => {
    setIsAuthenticating(true);

    // 생체 인증 가능 여부 확인
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert("지문 인증 불가", "이 기기는 지문 인증을 지원하지 않습니다.");
      setIsAuthenticating(false);
      return;
    }

    // 등록된 생체 인증 정보 확인
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert("지문 인증 불가", "등록된 생체 인증 정보가 없습니다.");
      setIsAuthenticating(false);
      return;
    }

    // 지문 인증 실행
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "지문으로 본인 인증",
      fallbackLabel: "인증 실패 시 비밀번호 입력",
    });

    setIsAuthenticating(false);

    if (result.success) {
      Alert.alert("출근 등록 성공", "출근이 성공적으로 등록되었습니다.");
      // 인증 성공 후의 로직 추가 (예: 서버 전송, 화면 이동 등)
    } else {
      Alert.alert("출근 등록 실패", "지문 인증에 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>서울시 중구 필동3가</Text>
        <Text style={styles.subTitle}>곧 출근하실 시간~ 혹은 시간 표시</Text>
        <TouchableOpacity style={styles.statusButton}>
          <Text style={styles.statusButtonText}>출근이 가능합니다</Text>
        </TouchableOpacity>
      </View>

      {/* 지도 */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.5642135, // 서울 중심 좌표
          longitude: 127.0016985,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: 37.5642135,
            longitude: 127.0016985,
          }}
          title="출근 위치"
          description="서울시 중구 필동3가"
        />
      </MapView>

      {/* 출근 등록 버튼 */}
      <TouchableOpacity
        style={styles.clockInButton}
        onPress={handleClockIn} // 지문 인증 호출
        disabled={isAuthenticating} // 인증 중에는 버튼 비활성화
      >
        <Text style={styles.clockInButtonText}>
          {isAuthenticating ? "인증 중..." : "출근 등록"}
        </Text>
      </TouchableOpacity>

      {/* 하단 네비게이션 */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabButtonText}>홈</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabButtonText}>복지 대상자 관리</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabButtonText}>설정</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ClockInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  statusButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  statusButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  map: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  clockInButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    marginHorizontal: 20,
    alignItems: "center",
    borderRadius: 8,
  },
  clockInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  tabButton: {
    alignItems: "center",
  },
  tabButtonText: {
    fontSize: 12,
    color: "#666",
  },
});
