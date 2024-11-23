import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';
import 'dart:async';


class MyTimer extends StatefulWidget
{
  const MyTimer
  ({
    super.key, 
    required this.navigationDestinationsTrue(),
    required this.navigationDestinationsFalse(),
  });
  final VoidCallback navigationDestinationsTrue;
  final VoidCallback navigationDestinationsFalse;
  @override
  State<MyTimer> createState() => _MyTimerState();
}

class _MyTimerState extends State<MyTimer> 
  with TickerProviderStateMixin
{
  late VoidCallback navigationDestinationsTrue = widget.navigationDestinationsTrue;
  late VoidCallback navigationDestinationsFalse = widget.navigationDestinationsFalse;
  TimeOfDay? time = const TimeOfDay(hour: 0, minute: 20);
  late AnimationController controller;
  Timer? timer;

  bool isTimerRunning = false;
  bool isTimerPaused = false;

  int hour = 0;
  int minute = 10;
  int startTimeInSeconds = 600;
  int remainTimeInSeconds = 600;

  int timeTillBubble = 0;
  int secondsForBubble = 30;
  int incBubbleAmount = 1;

  int bubbleAmount = 0;

  String clickString = 'Start';

  void clickTimer()
  {
    if(isTimerRunning)
    {
      clickString = 'Start';
      pauseTimer();
      navigationDestinationsTrue();
    }
    else
    {
      clickString = 'Pause';
      startTimer();
      navigationDestinationsFalse();
    }
  }

  void startTimer()
  {
    isTimerRunning = true;
    timer = Timer.periodic(const Duration(seconds:1), (clock)
    {
      setState(() {
        if(remainTimeInSeconds <= 0) 
        {
          remainTimeInSeconds = 0;
          isTimerRunning = false;
          controller.stop();
          timer?.cancel();
          controller.value = 1;
          incBubbleFunction();
          return;
        }
        timeTillBubble += incBubbleAmount;
        if(timeTillBubble >= secondsForBubble)
        {
          timeTillBubble -= secondsForBubble;
          bubbleAmount++;
        }
        remainTimeInSeconds--;
        // controller.forward(from: controller.value); // Smooth Ticking Down
        controller.value = 1 - (remainTimeInSeconds / startTimeInSeconds); // Step Ticking Down
      });
    });
  }

  void pauseTimer()
  {
    setState(() {
      controller.stop();
      isTimerPaused = true;
      isTimerRunning = false;
    });
    timer?.cancel();
  }

  void resetTimer()
  {
    setState(() {
      clickString = 'Start';
      controller.stop();
      remainTimeInSeconds = startTimeInSeconds;
      controller.duration = Duration(seconds: remainTimeInSeconds);
      controller.reset();
      isTimerPaused = false;
      isTimerRunning = false;
      timeTillBubble = 0;
    });
    navigationDestinationsTrue();
    timer?.cancel();
  }

  void setStartingTime()
  {
    if(time?.hour != null || time?.minute != null)
    {
      // THIS IS SUCH A BS WAY OF SOLVING MY PROBLEM
      hour = int.parse('${time?.hour}');
      minute = int.parse('${time?.minute}');
    }
    else
    {
      return;
    }
    setState(() {
      startTimeInSeconds = (hour * 3600) + (minute *60);
      resetTimer();
    });
    navigationDestinationsTrue();
  }

  void incBubbleFunction() async
  {
    bool canInc = await incBubbles(bubbleAmount);
    if(canInc)
    {
      curBubbles += bubbleAmount;
    }
    else 
    {
      'error';
    }
  }

  @override
  void initState() {
    controller = AnimationController(
      vsync: this,
      duration: Duration(seconds: remainTimeInSeconds),
    )..addListener(() {
        setState(() {});
      });
    super.initState();
  }

  @override
  void dispose()
  {
    timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(context)
  {
    int seconds = remainTimeInSeconds % 60;
    int minutes = (remainTimeInSeconds / 60).floor();

    void changeTime() async
    {
      time = await showTimePicker
      (
        context: context, 
        initialTime: TimeOfDay(hour: hour, minute: minute),
        initialEntryMode: TimePickerEntryMode.inputOnly,
        builder: (BuildContext context, Widget? child) {
          return MediaQuery(
          data: MediaQuery.of(context).copyWith(alwaysUse24HourFormat: true),
          child: child!
          );
        },
      );
      setStartingTime();
    }

    return Scaffold
    (
      body: 
      Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
            Stack
            (
            children:
            [
              Center(
                child: CircularProgressIndicator
                (
                        value: 1- controller.value,
                        semanticsLabel: 'Circular progress indicator',
                        strokeAlign: 35,
                        strokeWidth: 5,
                ),
              ),
              Column
              (
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}'),
                  Row
                  (
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: 
                    [
                      ElevatedButton(onPressed: clickTimer, child: Text(clickString)),
                      ElevatedButton(onPressed: changeTime, child: const Text('Set')),
                      ElevatedButton(onPressed: resetTimer, child: const Text('Reset')),
                    ],
                  ),
                ],
              ),
            ]
          ),
        ],
      ),
    );
  }
}