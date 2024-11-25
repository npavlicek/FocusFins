import 'package:flutter/material.dart';
import 'package:focusfinsapp/util.dart';
import 'package:webview_flutter_plus/webview_flutter_plus.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/services.dart';

final storage = new FlutterSecureStorage();

class MyReef extends StatefulWidget {
  const MyReef({super.key});
  @override
  State<MyReef> createState() => _MyReefState();
}

class _MyReefState extends State<MyReef> {
  WebViewControllerPlus _controller = WebViewControllerPlus();

  @override
  void initState() {
    _controller = WebViewControllerPlus();
    _controller.setJavaScriptMode(JavaScriptMode.unrestricted);
    _controller.loadFlutterAssetServer('assets/index.html');
    _controller.addJavaScriptChannel('FocusFinsState',
        onMessageReceived: (message) {
      storage.read(key: 'token').then((token) {
        storage.read(key: 'id').then((id) {
          if (token != null && id != null) {
            _controller
                .runJavaScript('initApp("$token", "$id");')
                .onError((err, stacktrace) {
              if (err != null) {
                print("THERE IS AN ERROR RUNNING THE JS: " + err.toString());
              }
            });
          }
        });
      });
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return WebViewWidget(controller: _controller);
  }
}
