import { historyStyles } from "@/assets/styles/rootstyles/history.styles";
import { View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";


const RenderSkeletonAbsen = () => {
    return (
        <SkeletonPlaceholder>
            {Array.from({ length: 3 }).map((_,index) => (
                <View
                    key={index}
                    style={historyStyles.listContainer}
                >
                    <View style={historyStyles.listHeader}>
                        <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
                        <SkeletonPlaceholder.Item width={60} height={60} borderRadius={50} />
                    </View>
                </View>
            ))}
        </SkeletonPlaceholder>
    )
}

export default RenderSkeletonAbsen;