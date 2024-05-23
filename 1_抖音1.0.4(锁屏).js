"ui";
importClass(android.view.View);
importClass(android.content.Intent);
importClass(android.net.Uri);
importClass(android.provider.Settings);
importClass(android.view.WindowManager);
var mname = '福袋'
var mversion = '1.0.1'
var mclolor = '#4EBFDD'
var scriptTitle = mname + ' v' + mversion

var configData = {
    M858326: null,
    F645210: false,
    H645600: null,
    V597406: 0,
    rand2to4: random(2, 4),
    rand10: random(0.5, 0.55),
    rand11: random(0.1, 0.15),
    timeM: 60000,
    timeS: 1000,
    //悬浮尺寸
    wndW: 200,
    wndH: 50,
}

//玩家配置
var userInfo = {
    tuijian: false, //推荐入口
    guanzhu: false, //关注入口
    mtime: 3, //默认时间
}

//程序线程
var mthreads = {
    startT: null, //默认线程
    otherT: null,
}

//////////////////////////////////////////////////////////悬浮窗口
var execution = null;

function ShowWnd() {

    var window = floaty.window(
        <vertical>
            <button id="action" text="开始" w="25" h="50" textSize="11sp" bg="#00ffff" />
            <button id="btnEnd" text="结束" w="25" h="50" textSize="11sp" bg="#e63f00" />
            <button id="btnShow" text="显示" w="25" h="50" textSize="11sp" bg="#00AA55" />
        </vertical>
    );

    window.setPosition(0, device.height - 500);


    //记录按键被按下时的触摸坐标
    var x = 0,
        y = 0;
    //记录按键被按下时的悬浮窗位置
    var windowX, windowY;
    //记录按键被按下的时间以便判断长按等动作
    var downTime;

    window.action.setOnTouchListener(function (view, event) {
        switch (event.getAction()) {
            case event.ACTION_DOWN:
                x = event.getRawX();
                y = event.getRawY();
                windowX = window.getX();
                windowY = window.getY();
                downTime = new Date().getTime();
                return true;
            case event.ACTION_UP:
                //手指弹起时如果偏移很小则判断为点击
                if (Math.abs(event.getRawY() - y) < 5 && Math.abs(event.getRawX() - x) < 5) {
                    onClick();
                }
                return true;
        }
        return true;
    });

    window.btnEnd.setOnTouchListener(function (view, event) {
        switch (event.getAction()) {
            case event.ACTION_DOWN:
                x = event.getRawX();
                y = event.getRawY();
                windowX = window.getX();
                windowY = window.getY();
                downTime = new Date().getTime();
                return true;
            case event.ACTION_UP:
                //手指弹起时如果偏移很小则判断为点击
                if (Math.abs(event.getRawY() - y) < 5 && Math.abs(event.getRawX() - x) < 5) {
                    onClickEnd();
                }
                return true;
        }
        return true;
    });

    window.btnShow.setOnTouchListener(function (view, event) {
        switch (event.getAction()) {
            case event.ACTION_DOWN:
                x = event.getRawX();
                y = event.getRawY();
                windowX = window.getX();
                windowY = window.getY();
                downTime = new Date().getTime();
                return true;
            case event.ACTION_UP:
                //手指弹起时如果偏移很小则判断为点击
                if (Math.abs(event.getRawY() - y) < 5 && Math.abs(event.getRawX() - x) < 5) {
                    onClickShow();
                }
                return true;
        }
        return true;
    });
    // console.show()


    function onClick() {
        if (window.action.getText() === '开始') {
            // execution = engines.execScriptFile(path);
            uiStart();
            window.action.setText('暂停');
        } else {
            if (mthreads.startT == null) { } else {
                mthreads.startT.interrupt();
                mthreads.startT = null;
            }
            window.action.setText('开始');
        }
    }

    function onClickEnd() {
        if (mthreads.startT == null) { } else {
            mthreads.startT.interrupt();
            mthreads.startT = null;
        }
        console.hide();
        exit()
    }

    function onClickShow() {
        if (console.isShowing()) {
            console.hide();
            window.btnShow.setText('显示');
        } else {
            console.show()
            window.btnShow.setText('隐藏');
        }
    }
}
//////////////////////////////////////////////////////////

var UIstr = ScriptUI.toString()
var UIstr = UIstr.slice(UIstr.indexOf('{'), UIstr.lastIndexOf('}')).slice(1, -2).replace(/项目标题/g, scriptTitle).replace(/#4EBFDD/g, mclolor)
configIDArr = UIstr.match(/ id( )?=( )?["|'].*?["|']/g).map(item => item.replace(/ id( )?=( )?["|']|"|'/g, ''))
ui.statusBarColor(mclolor);
ui.layout(UIstr);

function ScriptUI() {
    <vertical>
        <appbar>
            <toolbar bg="#4EBFDD" layout_height="60" margin="-2" id="toolbar" title="项目标题" />
            <tabs id="tabs" />
        </appbar>
        <viewpager id="viewpager">
            <frame>
                <scroll>
                    <vertical gravity="center">
                        <card w="*" h="auto" margin="10 5" cardCornerRadius="2dp" cardElevation="1dp" gravity="center_vertical">
                            <vertical padding="18 8" h="auto">
                                <linear>
                                    <Switch margin="12 0" layout_weight="1" id="autoService" text="无障碍服务" textSize="15sp" checked="true" />
                                    <Switch margin="12 0" layout_weight="1" id="floatingWindowPermission" text="悬浮窗权限" textSize="15sp" checked="false" />
                                </linear>
                            </vertical>
                            <View bg="#4EBFDD" h="*" w="5" />
                        </card>
                        <text id="login" text="wx: sout-lanys" layout_gravity="center" textColor="red" w="auto" textStyle="bold" />
                        <horizontal padding="18 8" h="auto">
                            <card w="auto" h="auto" margin="5 5" cardCornerRadius="2dp" cardElevation="1dp" gravity="center_vertical">
                                <button id="stopScript" h="auto" style="Widget.AppCompat.Button.Colored" text="关 闭" textStyle="bold" color="#ffffff" bg="#4EBFDD" foreground="?selectableItemBackground" layout_gravity="bottom" />
                            </card>
                            <card w="*" h="auto" margin="5 5" cardCornerRadius="2dp" cardElevation="1dp" gravity="center_vertical">
                                <button id="startScript" h="auto" text="开 始 运 行" textStyle="bold" color="#ffffff" bg="#4EBFDD" foreground="?selectableItemBackground" layout_gravity="bottom" />
                            </card>
                        </horizontal>
                        <radiogroup>
                        </radiogroup>

                        <vertical padding="18 8" h="auto">
                            <vertical>
                                <text text="福袋入口：" padding="8 8 8 8" textSize="17" h="auto" />
                                <radiogroup orientation="horizontal" padding="5 5 5 5">
                                    <radio id="luckyBagRecommended" text="推荐入口" textSize="17" paddingRight="5" />
                                    <radio id="luckyBagFollow" text="关注入口" textSize="17" checked="true" paddingRight="5" />
                                </radiogroup>
                            </vertical>
                            <horizontal>
                                <text text="福袋时间：" padding="8 8 8 8" textSize="17" h="auto" />
                                <input id="luckyBagTime" color="#666666" paddingLeft="2" w="150" value="5" />
                                <text text="(单位分)" padding="8 8 8 8" textSize="17" h="*" />
                            </horizontal>
                        </vertical>
                    </vertical>
                </scroll>
            </frame>
        </viewpager>
    </vertical>
}
ui.viewpager.setTitles(["基础模块"]);
ui.tabs.setupWithViewPager(ui.viewpager);

ui.emitter.on("resume", function () {
    ui.autoService.checked = auto.service != null;
    // ui.floatingWindowPermission.checked = floaty.checkPermission() != false
});

ui.autoService.on("check", function (checked) {
    if (checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if (!checked && auto.service != null) {
        auto.service.disableSelf();
    }
});

ui.stopScript.on("click", () => {
    if (mthreads.startT == null) { } else {
        mthreads.startT.interrupt();
        mthreads.startT = null;
    }
    exit()
});

//点击开始运行
ui.startScript.on("click", function () {
    // app.launchApp("抖音");
    ShowWnd();
})


function uiStart() {
    //获取配置
    let is1 = ui.luckyBagRecommended.isChecked();
    if (is1) {
        userInfo.tuijian = is1
    }
    let is2 = ui.luckyBagFollow.isChecked();
    if (is2) {
        userInfo.guanzhu = is2
    }
    let FDt = ui.luckyBagTime.getText();
    if (!IsFDT(FDt)) {
        userInfo.mtime = FDt
    }
    //开始线程
    mthreads.startT = threads.start(function () {
        onStart()
    });
}

function onStart() {
    // sleep(500, 1000);
    let mFrameLayout = "android.widget.FrameLayout";
    let mTextView = "android.widget.TextView"
    if (btnT = classNameContains("Button").textContains("我知道了").findOne(2000)) {
        btnT.click();
    }
    if (className(mFrameLayout).findOnce()) {
        // 在首页
        if (className(mTextView).text("首页").findOne(1000)) {
            toastLog("在首页")
            click("首页")
            sleep(3000, 6000);
            if (userInfo.tuijian) {
                H169894()
            } else if (userInfo.guanzhu) {
                B046710()
            }
        } else {
            try {
                // sleep(4000, 6000);
                let TextView0 = className("android.widget.TextView").id("user_name").findOnce();
                if (TextView0) {
                    let OOO0OOO0O0OOOOO0O = TextView0.getText();
                    console.log("已在直播间：", OOO0OOO0O0OOOOO0O);
                    AboutFD()
                } else {
                    let TextView = className("android.widget.TextView").id("user_name").findOnce();
                    if (TextView) {
                        let OOO0OOO0O0OOOOO0O = TextView.getText();
                        console.log("已在直播间：", OOO0OOO0O0OOOOO0O);
                        AboutFD()
                    }
                }
            } catch (error) {
                console.log("数据异常：", error);
                AboutFD()
            }
        }
    }
}

function H169894() {
    if (btnT = className("android.widget.Button").descContains("侧边栏").findOne(2000)) {
        btnT.click();
        sleep(4000, 6000);
        if (clickBtn(className("android.widget.TextView").textContains("直播广场").findOnce())) {
            AboutFD()
        } else {
            console.log("没找到");
        }
    }
}

function B046710() {
    click("关注")
    sleep(2000, 4000);
    if (clickBtn(classNameContains("Button").descMatches(/(.*直播中.*)/).findOnce())) {
        sleep(5000, 6000);
        // 限时任务
        if (beginBtn = classNameContains("FlattenUIText").textContains("限时任务").findOne(2000)) {
            back()
            sleep(2000, 4000);
            back()
        }
        AboutFD()
    } else if (clickBtn(classNameContains("TextView").descMatches(/(.*高领.*)/).findOnce())) {
        sleep(5000, 6000);
        // 限时任务
        if (beginBtn = classNameContains("FlattenUIText").textContains("限时任务").findOne(2000)) {
            back()
            sleep(2000, 4000);
            back()
        }
        AboutFD()
    } else {
        console.log("未找到直播间");
    }
}


function AboutFD() {
    while (true) {
        sleep(5000, 12000);
        const btnT = className("android.widget.Button").descMatches(/(.*电商.*)/).findOne(1000);
        if (btnT) {
            sleep(5000, 6000);
        }
        //检测福袋是否符合要求
        setFD();
    }
}

function setFD() {
    const FD = className("com.lynx.tasm.behavior.ui.LynxFlattenUI").descMatches(/(.*福袋.*)/).findOne(1000);
    if (FD) {
        let FDtime = FD.desc();
        if (!IsFDT(FDtime) && !V559387(FDtime)) {
            back()
        } else {
            // 判断是否包含数字
            if (!IsFDT(FDtime) && V559387(FDtime)) {
                console.log("福袋时间：", FDtime);
                var FD_T = FDtime.split(" ")
                var FD_M = FD_T[1].split("分")
                var FD_S = FD_M[1].split("秒")
                //获取剩余时间
                let DDt = addF((parseInt(FD_M[0] * 60000)), parseInt(FD_S[0] * 1000));
                if (DDt) {
                    console.log("等待时间秒：", DDt, "秒");
                    console.log("规定等待时间秒：", userInfo.mtime * configData.timeM, "秒");
                    if (clickBtn(FD)) {
                        console.log("点击福袋");
                        //随机25~85秒
                        let RTime = 5000;
                        if (DDt > 85000) {
                            RTime = random(25000, 85000);
                            let SDDT = DDt - RTime;
                            console.log("将在", Math.round((SDDT / configData.timeM)), "分" + Math.round((SDDT % configData.timeM) / 1000), "秒后点击");
                            console.log("点击后剩余时间：", Math.round(RTime/1000), "秒");
                            device.keepScreenDim(500);
                            //锁屏
                            var success = runtime.accessibilityBridge.getService().performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_LOCK_SCREEN)
                                
                            console.log("锁屏（003）");
                            sleep(SDDT - 500);
                            if(!device.isScreenOn()) { 
                                device.wakeUp();  
                                sleep(800); 
                                swipe(200, device.height / 5 * 4, 400, device.height / 5, 201); console.log("屏幕已开启（003）");
                            }
                        }

                        if (text("加入粉丝团").findOnce()) {
                            console.log("加入粉丝团");
                            clickBtn(text("加入粉丝团").findOnce())
                            sleep(500);
                            if (text("加入粉丝团").findOnce()) {
                                console.log("加入粉丝团");
                                clickBtn(text("加入粉丝团").findOnce())
                                back()
                            }
                        }
                        if (text("观看直播5分钟").findOnce() && clickBtn(text("开始观看直播任务").findOnce()) ) {
                            console.log("开始观看直播任务，福袋时间为：", Math.round((DDt / configData.timeM)), "分钟")
                            device.keepScreenDim(500);
                            var success = runtime.accessibilityBridge.getService().performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_LOCK_SCREEN)
                            console.log("锁屏（002）");
                            sleep(60000 * 5 - 500);
                            if(!device.isScreenOn()) { 
                                device.wakeUp();  
                                sleep(800); 
                                swipe(200, device.height / 5 * 4, 400, device.height / 5, 201); console.log("屏幕已开启（002）");}
                            return true;
                        }

                        if (text("加入粉丝团 (1钻石)").findOnce()) {
                            console.log("加入粉丝团 (1钻石");
                            clickBtn(text("加入粉丝团 (1钻石)").findOnce())
                        }
                        var isSleep = false;
                        if (clickBtn(text("一键发表评论").findOnce())) {
                            console.log("参与福袋，福袋时间为：", Math.round((DDt / configData.timeM)), "分钟")
                            isSleep = true;
                            clickBtn(text("我知道了").findOnce())
                            return true;
                        }
                        else if (clickBtn(text("参与抽奖").findOnce())) {
                            console.log("参与抽奖，福袋时间为：", Math.round((DDt / configData.timeM)), "分钟")
                            isSleep = true;
                            clickBtn(text("我知道了").findOnce())
                            return true;
                        }
                        else {
                            if (text("参与成功 等待开奖").findOnce()) {
                                console.log("参与成功 等待开奖");
                                isSleep = true;
                            }

                            if (text("开始观看直播任务").findOnce()) {
                                clickBtn(text("开始观看直播任务").findOnce())
                                console.log("开始观看直播任务");
                                back()
                                isSleep = true;
                            }

                            if (text("即将开奖 无法参与").findOnce()) {
                                //clickBtn(text("即将开奖 无法参与").findOnce())
                                console.log("即将开奖 无法参与");
                                back()
                                isSleep = true;
                            }
                        }

                        if(isSleep)
                        {
                            // 任务完成后，延迟一段时间（例如2秒）再锁屏，防止立即锁屏导致任务未完成
                            if (RTime > 15000) {
                                device.keepScreenDim(500);
                                var success = runtime.accessibilityBridge.getService().performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_LOCK_SCREEN)
                                console.log("锁屏");
                                RTime = RTime - 2000;
                            }
                            sleep(RTime);
                        }
                        if(!device.isScreenOn()) { 
                            device.wakeUp();  
                        sleep(800); 
                        swipe(200, device.height / 5 * 4, 400, device.height / 5, 201); console.log("屏幕已开启（001）");}
                    }
                }
            } else {
                back()
            }
        }
    } else {
        console.log("没有福袋");
        if (text("参与成功 等待开奖").findOnce()) {
            console.log("参与成功 等待开奖");
            back()
        }
        if (text("我知道了").findOnce()) {
            clickBtn(text("我知道了").findOnce())
            console.log("我知道了");
        }
        if (text("活动已结束").findOnce()) {
            //clickBtn(text("活动已结束").findOnce())
            console.log("活动已结束");
            back()
        }
        if (text("即将开奖 无法参与").findOnce()) {
            //clickBtn(text("即将开奖 无法参与").findOnce())
            console.log("即将开奖 无法参与");
            back()
        }
        if (text("开始观看直播任务").findOnce()) {
            clickBtn(text("开始观看直播任务").findOnce())
            console.log("开始观看直播任务");
            back()
        }
        // qiehuan()
        return false
    }

}

function V559387(str) {
    return /[0-9]/.test(str);
}


function addF(a, b) {
    return a + b;
}

//抢福袋
function DoFD(FD) {
    console.log("FD=" + FD);
    if (FD) {
        if (classNameContains("FlattenUIImage").findOne(1000)) {
            console.log("抢福袋=1");
            if (text("参与成功 等待开奖").findOnce()) {
                back()
            } else {
                // back()
            }
        } else {
            console.log("抢福袋=2");
            const TextViewFD = className("com.lynx.tasm.behavior.ui.LynxFlattenUI").descMatches(/(.*福袋.*)/).findOne(1000);
            if (clickBtn(TextViewFD)) {
                console.log("抢福袋=2=1");
                if (clickBtn(text("一键发表评论").findOnce())) {
                    console.log("参与福袋");
                    console.log("参与福袋，福袋时间为：", Math.round((FDtime / configData.timeM)), "分钟")
                    // toast("参与福袋，福袋时间为：", Math.round((FDtime / configData.timeM)), "分钟")
                    sleep(FDtime);
                    clickBtn(text("我知道了").findOnce())
                    return true;
                }
            }
        }
    }
}

//下滑 切换直播间
function qiehuan() {
    console.log("切换直播间");
    console.log(device.width / configData.rand2to4 + "," + device.height * configData.rand10);
    console.log(device.width / configData.rand2to4 + "," + device.height * configData.rand11);
    swipe(device.width / configData.rand2to4, device.height * configData.rand10, device.width / configData.rand2to4, device.height * configData.rand11, random(200, 400))

}

function IsFDT(FDtime) {
    if (FDtime !== null && FDtime !== undefined && FDtime !== '' && FDtime != "") {
        return false;
    } else {
        return true;
    }
}

//点击控件位置
function clickBtn(btn) {
    if (btn) {
        click(btn.bounds().centerX(), btn.bounds().centerY())
        sleep(2000, 4000);
        return true;
    }
    return false;
}