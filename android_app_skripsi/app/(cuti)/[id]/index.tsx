import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { dummyCuti } from "@/data/dummyCuti";
export default function DetailCuti() {
  const { id } = useLocalSearchParams();
  const data = dummyCuti.find((item) => item.id === id);
  const router = useRouter();

  if (!data) {
    return <Text style={{ textAlign: "center", marginTop: 50 }}>Cuti not found.</Text>;
  }

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push('/cuti')}>
  <Text>Kembali</Text>
</TouchableOpacity>
      <Image
        source={require("../../../assets/icons/cuti.png")}
        style={styles.icon}      />
      <Text style={styles.name}>{data.name}</Text>
      <Text>Status: {data.cutiStatus}</Text>
      <Text>Tanggal Pengajuan: {data.submissionDate}</Text>
      <Text>Mulai: {data.startDate}</Text>
      <Text>Selesai: {data.endDate}</Text>
      <Text>Alasan: {data.reason}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  icon: { width: 40, height: 40, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
});
