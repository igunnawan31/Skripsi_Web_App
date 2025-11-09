import { homeStyles } from "@/assets/styles/rootstyles/home/home.styles";
import { ScrollView, Text, View } from "react-native";

const FeatureComponent = () => {
    return (
        <View style={homeStyles.featureContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>Feature</Text>
            {/* <ScrollView
                horizontal
                contentContainerStyle={{ 
                    paddingVertical: 20
                }}
            > 
            </ScrollView> */}
        </View>
    )
}

export default FeatureComponent;