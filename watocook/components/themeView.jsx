import { View } from 'react-native';
import { Colors } from '../constants/style';

export const ThemeView = ({ children , style , props }) => {
  
const backgroundColor = Colors.background;

 return <View style={{flex: 1, backgroundColor: backgroundColor , ...style}} {...props}>{children}</View>
}
