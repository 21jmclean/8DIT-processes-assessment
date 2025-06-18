import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';

void main() {
  runApp(const MainApp());
}

void e_string() async {
  late AudioPlayer player = AudioPlayer();
  await player.setSource(AssetSource("e-string.mp3"));
  player.resume(); 
}

void a_string() async {
  late AudioPlayer player = AudioPlayer();
  await player.setSource(AssetSource("a-string.mp3"));
  player.resume();
}

void d_string() async {
  late AudioPlayer player = AudioPlayer();
  await player. setSource(AssetSource("d-string.mp3"));
  player.resume();
}

void g_string() async {
  late AudioPlayer player = AudioPlayer();
  await player.setSource(AssetSource("g-string.mp3"));
  player.resume();
}


void b_string() async {
  late AudioPlayer player = AudioPlayer();
  await player.setSource(AssetSource("b-string.mp3"));
  player.resume();
}

void e2_string() async {
  late AudioPlayer player = AudioPlayer();
  await player.setSource(AssetSource("e2-string.mp3"));
  player.resume();
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return  MaterialApp(
      theme: ThemeData(
        primarySwatch: Colors.blue,
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          backgroundColor: Colors.blue,
          foregroundColor: Colors.black,
          fixedSize: Size(100, 100),
          
        )
      ) 
      ),
      title: "Guitar Tuner Suite",
      home: Scaffold(
        appBar: AppBar(
          centerTitle: true,
          title: Text("Guitar Tuner Suite"),
        ),
        
        body: 
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          spacing: 20,
          children: [
            Column(
              spacing: 20,
              children: [
                TextButton(
                child: const Text("E"),
                  onPressed: e_string),
                  
                TextButton(
                  child: const Text("A"),
                  onPressed: a_string),

                TextButton(
                child: const Text("D"),
                onPressed: d_string),
              ],
            ),
            Column(
              spacing: 20,
              children: [
                TextButton(
                  child: const Text("G"),
                  onPressed: g_string),

                TextButton(
                  child: const Text("B"),
                  onPressed: b_string),

                TextButton(
                  child: const Text("E"),
                  onPressed: e2_string)],
                )
              ]
            )
          )
        );
  }
}

