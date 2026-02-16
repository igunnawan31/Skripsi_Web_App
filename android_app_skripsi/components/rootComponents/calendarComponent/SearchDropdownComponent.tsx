import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import COLORS from "@/constants/colors";
import { calendarStyles } from "@/assets/styles/rootstyles/calendar.styles";

interface Props<T> {
    visible: boolean;
    onClose: () => void;
    items: T[];
    selected: T | null;
    onChange: (item: T | null) => void;

    getId: (item: T) => string | number;
    getLabel: (item: T) => string;

    title?: string;
    placeholder?: string;
}

export default function SearchDropdownComponent<T>({
    visible,
    onClose,
    items,
    selected,
    onChange,
    getId,
    getLabel,
    title = "Select Item",
    placeholder = "Search...",
}: Props<T>) {
    const [query, setQuery] = useState("");

    const filtered = items.filter((item) =>
        getLabel(item).toLowerCase().includes(query.toLowerCase())
    );

    const selectItem = (item: T) => {
        if (selected && getId(selected) === getId(item)) {
            onChange(null);
        } else {
            onChange(item);
        }
    };

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            style={calendarStyles.modalFilterContainer}
        >
            <View style={calendarStyles.filterModal}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
                    {title}
                </Text>
                <View style={{ flex: 1, width: "100%", gap: 10, }}>
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 30, gap: 10 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={calendarStyles.inputSearch}>
                            <Image
                                source={require("../../../assets/icons/search.png")}
                                style={{ tintColor: COLORS.border, height: 20, width: 20 }}
                            />
                            <TextInput
                                placeholder={placeholder}
                                value={query}
                                onChangeText={setQuery}
                            />
                        </View>

                        {filtered.map((item) => {
                            const isSelected =
                                selected && getId(selected) === getId(item);

                            return (
                                <TouchableOpacity
                                    key={String(getId(item))}
                                    onPress={() => selectItem(item)}
                                    style={[
                                        calendarStyles.projectSelect,
                                        isSelected
                                            ? {
                                                borderColor: COLORS.primary,
                                                backgroundColor: COLORS.primaryOpacity20,
                                            }
                                            : {
                                                borderColor: COLORS.border,
                                                backgroundColor: COLORS.white,
                                            },
                                    ]}
                                >
                                    <Text style={{ fontSize: 16 }}>
                                        {getLabel(item)}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
                <View style={{ justifyContent: "flex-end", width: "100%" }}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={calendarStyles.submitButton}
                    >
                        <Text style={calendarStyles.buttonSelectAll}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
