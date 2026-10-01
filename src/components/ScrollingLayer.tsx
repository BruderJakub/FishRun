import { Image, View } from "react-native";

type Props = {
  source: number;
  height: number;
  screenWidth: number;
  scroll: number; // total distance scrolled, keeps growing
  top?: number;
  bottom?: number;
  zIndex?: number;
};

export default function ScrollingLayer({ source, height, screenWidth, scroll, top, bottom, zIndex = 0 }: Props) {
  const asset = Image.resolveAssetSource(source);
  const tileW = Math.max(1, Math.round(height * (asset.width / asset.height))); // keeps the image's aspect ratio
  const count = Math.ceil(screenWidth / tileW) + 1;
  const offset = -(scroll % tileW);

  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top, bottom, height, zIndex, overflow: "hidden" }}>
      {Array.from({ length: count }, (_, i) => (
        <Image
          key={i}
          source={source}
          resizeMode="stretch"
          style={{ position: "absolute", top: 0, height, width: tileW + 1, left: Math.round(offset + i * tileW) }}
        />
      ))}
    </View>
  );
}