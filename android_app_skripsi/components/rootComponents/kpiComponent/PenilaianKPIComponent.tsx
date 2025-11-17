import penilaianKpiStyles from "@/assets/styles/rootstyles/kpi/penilaiankpi.styles";
import COLORS from "@/constants/colors";
import { dummySkalaNilai } from "@/data/dummySkalaNilai";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";

type PenilaianKPIComponentProps = {
    page: number;
    categoriesQuestion: [string, any[]][];
    setPage: (page: number) => void;
    convertNilai: any[];
    judul: string;
    sudahDinilai: boolean;
    formJawaban?: { [key: string]: { nilai: number | null, notes: string } };
    handleInputChange?: (id: string, nilai: number) => void;
    handleNotesChange?: (id: string, notes: string) => void;
    allAnswered?: boolean;
    showModal?: boolean;
    setShowModal?: (value: boolean) => void;
}

const PenilaianKPIComponent = ({ 
    page,
    categoriesQuestion,
    setPage,
    convertNilai,
    judul,
    sudahDinilai,
    formJawaban,
    handleInputChange,
    handleNotesChange,
    allAnswered,
    showModal,
    setShowModal,
}: PenilaianKPIComponentProps) => {
    return (
        <>
            <View style={penilaianKpiStyles.headerDetailContainer}>
                <Text style={penilaianKpiStyles.headerDetailTitle}>
                    {judul}
                </Text>
                <View style={penilaianKpiStyles.headerPageContainer}>
                    <Text style={penilaianKpiStyles.headerPageText}>
                        {page + 1} / {categoriesQuestion.length}
                    </Text>
                </View>
            </View>
            <PagerView
                style={{ flex: 1 }}
                initialPage={0}
                onPageSelected={(e) => setPage(e.nativeEvent.position)}    
            >
                {categoriesQuestion.map(([kategori, list]) => (
                    <View key={kategori} style={{ flex: 1 }}>
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1, paddingTop: 15, paddingBottom: 24, alignItems: "center" }}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={penilaianKpiStyles.categoryContainer}>
                                <Text style={penilaianKpiStyles.categoryTitle}>
                                    {kategori}
                                </Text>
                            </View>

                            {sudahDinilai ? (
                                list.map((item) => {
                                    const jawaban = convertNilai.find(j => j.pertanyaanId === item.id);
                                    if (!jawaban) return null;

                                    return (
                                        <View
                                            key={item.id}
                                            style={penilaianKpiStyles.cardContainer}
                                        >
                                            <Text style={penilaianKpiStyles.titleCard}>
                                                {item.pertanyaan}
                                            </Text>
                                            <Text style={{ fontSize: 14 }}>
                                                Nilai:
                                                <Text style={{ fontWeight: "600" }}>
                                                    {` ${jawaban.nilai} (${jawaban.label})`}
                                                </Text>
                                            </Text>
                                            <Text>Catatan:</Text>
                                            <Text style={penilaianKpiStyles.noteCard}>
                                                {jawaban.notes}
                                            </Text>
                                        </View>
                                    );
                                })
                            ) : (
                                list.map((item) => (
                                    <View
                                        key={item.id}
                                        style={penilaianKpiStyles.cardContainer}
                                    >
                                        <Text style={penilaianKpiStyles.titleCard}>
                                            {item.pertanyaan} <Text style={penilaianKpiStyles.errorText}>*</Text>
                                        </Text>
                                        <View style={penilaianKpiStyles.rowPenanda}>
                                            <Text style={penilaianKpiStyles.textCard}>TIdak Baik</Text>
                                            <Text style={penilaianKpiStyles.textCard}>Normal</Text>
                                            <Text style={penilaianKpiStyles.textCard}>Sangat Baik</Text>
                                        </View>
                                        <View style={{ height: 2, backgroundColor: COLORS.tertiary }} />
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            {dummySkalaNilai.map((skala) => {
                                                const selected = formJawaban?.[item.id]?.nilai === skala.nilai;
                                                return (
                                                    <TouchableOpacity
                                                        key={skala.nilai}
                                                        onPress={() => handleInputChange?.(item.id, skala.nilai)}
                                                        style={[penilaianKpiStyles.radioButton, { 
                                                            borderColor: selected ? COLORS.primary : COLORS.tertiary, 
                                                            backgroundColor: selected ? COLORS.primary : COLORS.white
                                                        }]}
                                                    >
                                                        <Text style={[penilaianKpiStyles.textCard, {
                                                            color: selected ? COLORS.white : COLORS.textPrimary
                                                        }]}>
                                                            {skala.nilai}
                                                        </Text>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>

                                        <Text style={{ marginTop: 10, marginBottom: 5 }}>Catatan: (jika tidak ada isi dengan: -)</Text>
                                        <TextInput
                                            placeholder="Tambahkan catatan…"
                                            style={penilaianKpiStyles.noteCard}
                                            multiline
                                            value={formJawaban?.[item.id]?.notes || ""}
                                            onChangeText={(text) => handleNotesChange?.(item.id, text)}
                                        />
                                    </View>
                                ))
                            )}
                        </ScrollView>
                    </View>
                ))}
            </PagerView>
            {!sudahDinilai && allAnswered && (
                <View style={{ padding: 16 }}>
                    <TouchableOpacity
                        style={penilaianKpiStyles.buttonSubmit}
                        onPress={() => setShowModal?.(true)}
                    >
                        <Text style={penilaianKpiStyles.headerPageText}>
                            Submit
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    )
}

export default PenilaianKPIComponent;