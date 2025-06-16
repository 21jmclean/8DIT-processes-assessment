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
  await player. setSource(AssetSource)
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return  MaterialApp(
      title: "Guitar Tuner Suite",
      home: Scaffold(
        appBar: AppBar(
          title: Text("Guitar Tuner Suite"),
        ),
        body: Center(
          child: TextButton(
            style: const ButtonStyle(
            backgroundColor: WidgetStatePropertyAll<Color>(Colors.green),
            ),
            child: const Text("E"),
            onPressed: e_string),
          child: TextButton(
            style: const ButtonStyle(
              backgroundColor: WidgetStatePropertyAll<Color>(Colors.green),
            ),
            child: const Text("A"),
            onPressed: a_string),
          )
        ),
      ),
    );
  }
}

