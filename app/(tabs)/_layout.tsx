import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme, StyleSheet, View, Text } from 'react-native';

import Colors from '../../constants/Colors';
import { ImageContextProvider } from '../../contexts/ImageContextProvider';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ImageContextProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'PhysioTrack',
          header: () => (
            <View style={styles.header}>
                <Text style={styles.title}> PhysioTrack</Text>
               <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1, marginTop:50 }}
                  />
                )}
              </Pressable>
            </Link>
            </View>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <Pressable>
          //       {({ pressed }) => (
          //         <FontAwesome
          //           name="info-circle"
          //           size={25}
          //           color={Colors[colorScheme ?? 'light'].text}
          //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //         />
          //       )}
          //     </Pressable>
          //   </Link>
          // ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Preview',
          tabBarStyle: { display: 'none'},
          tabBarIcon: ({ color }) => <TabBarIcon name="meetup" color={color} />,
        }}
      />
    </Tabs>
    </ImageContextProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    flexDirection:'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  title: {
    fontWeight:'bold', fontSize:30, color:'white', marginTop: 40, marginLeft: 10
  },
  icon: {

  }
})
