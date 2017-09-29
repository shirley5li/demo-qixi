       // 动画结束事件
       var animationEnd = (function() {
           var explorer = navigator.userAgent;
           if (~explorer.indexOf('WebKit')) {
               return 'webkitAnimationEnd';
           }
           return 'animationend';
       })();


       var container = $("#content");
       var swipe = Swipe(container);
       visualWidth = container.width();
       visualHeight = container.height();

       // 页面滚动到指定的位置
       function scrollTo(time, proportionX) {
           var distX = visualWidth * proportionX;
           swipe.scrollTo(distX, time);
       }

       // 获取数据
       var getValue = function(className) {
           var $elem = $('' + className + '');
               // 走路的路线坐标
           return {
               height: $elem.height(),
               top: $elem.position().top
           };
       };

       // 桥的Y轴
       var bridgeY = function() {
           var data = getValue('.c_background_middle');
           return data.top;
       }();


       //////////////////
       //灯动画 //
       //////////////////
        var lamp = {
            elem: $('.b_background'),
            bright: function() {
                this.elem.addClass('lamp_bright')
            },
            dark: function() {
                this.elem.removeClass('lamp_bright')
            }
        };

        //////////////////
        //开关门动画//
        /////////////////
    function doorAction(left, right, time) {
        var $door = $('.door');
        var doorLeft = $('.door_left');
        var doorRight = $('.door_right');
        var defer = $.Deferred();
        var count = 2;
        // 等待开门完成
        var complete = function() {
            if (count == 1) {
                defer.resolve();
                return;
            }
            count--;
        };
        doorLeft.transition({
            'left': left
        }, time, complete);
        
        doorRight.transition({
            'left': right
        }, time, complete);
        
         return defer;
    }
    // 开门
    function openDoor() {
        return doorAction('-50%', '100%', 2000);
    }
    // 关门
    function shutDoor() {
        return doorAction('0%', '50%', 2000);
    }

    //////////////////////////////////
    //鸟飞过//
    /////////////////////////////////
    var bird = {
        elem: $(".bird"),
        fly: function() {
            this.elem.addClass('birdFly')
            this.elem.transition({
                right: container.width()
            }, 15000, 'linear');
        }       
    };


       ///////////////////////
       // 小女孩 //
       //////////////////////
        var girl = {
            elem: $('.girl'),
            getHeight: function() {
                return this.elem.height();
            },
            // 转身动作
            rotate: function() {
                this.elem.addClass('girl_rotate');
            },
            setPosition: function() {
                this.elem.css({
                    left: visualWidth / 2,
                    top: bridgeY - this.getHeight()
                });
            },
            getPosition: function() {
                return this.elem.position();
            },
            getWidth: function() {
                return this.elem.width()
            }
         };      
       // 修正小女孩位置
       girl.setPosition();


    ///////////
    //loge动画 //
    ///////////
        var logo = {
            elem: $('.logo'),
            run: function() {
                this.elem.addClass('logolightSpeedIn')
                    .on(animationEnd, function() {
                        $(this).addClass('logoshake').off();
                    });
            }
        };
     /////////////////////
     //飘花瓣 //
     ////////////////////  
    var flutteringFlowerURL = [
        'http://img.mukewang.com/55adde120001d34e00410041.png',
        'http://img.mukewang.com/55adde2a0001a91d00410041.png',
        'http://img.mukewang.com/55adde5500013b2500400041.png',
        'http://img.mukewang.com/55adde62000161c100410041.png',
        'http://img.mukewang.com/55adde7f0001433000410041.png',
        'http://img.mukewang.com/55addee7000117b500400041.png'
    ]

        function flutteringFlower() {
        // 花瓣容器
        var $flowerContainer = $('#flutteringFlower');

        // 随机六张图
        function getImagesName() {
            return flutteringFlowerURL[(Math.floor(Math.random() * 6))];
        }
        // 创建一个花瓣元素
        function createFlowerBox() {
            var url = getImagesName();
            return $('<div class="flowerbox" />').css({
                'width': 41,
                'height': 41,
                'position': 'absolute',
                'backgroundSize': 'cover',
                'zIndex': 100000,
                'top': '-41px',
                'backgroundImage': 'url(' + url + ')'
            }).addClass('flowerRoll');
        }
        // 开始飘花
        setInterval(function() {
            // 运动的轨迹
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity    = 1,
                endPositionTop  = visualHeight - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration        = visualHeight * 10 + Math.random() * 5000;
            // 随机透明度，不小于0.5
            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;
            // 创建一个花瓣
            var $flower = createFlowerBox();
            // 设计起点位置
            $flower.css({
                left: startPositionLeft,
                opacity : randomStart
            });

            // 加入到容器
            $flowerContainer.append($flower);

            // 开始执行动画
            $flower.transition({
                top: endPositionTop,
                left: endPositionLeft,
                opacity: 0.7
            }, duration, 'ease-out', function() {
                $(this).remove() //结束后删除
            });
            
        }, 200);
    }

       /****************************************
        * 小孩走路
        * @param {[type]} container [description]
        ****************************************/
       function BoyWalk() {

           var container = $("#content");
           // 页面可视区域
           var visualWidth = container.width();
           var visualHeight = container.height();

           // 获取数据
           var getValue = function(className) {
               var $elem = $('' + className + '');
               //走路的路线坐标
               return {
                   height: $elem.height(),
                   top: $elem.position().top
               };
           };
           // 路的Y轴
           var pathY = function() {
               var data = getValue('.a_background_middle');
               return data.top + data.height / 2;
           }();
           
           var $boy = $("#boy");
           var boyHeight = $boy.height();

           // 设置下高度    
           $boy.css({
               top: pathY - boyHeight + 25
           });

           // 暂停走路
           function pauseWalk() {
               $boy.addClass('pauseWalk');
           }

           // 恢复走路
           function restoreWalk() {
               $boy.removeClass('pauseWalk');
           }

           // css3的动作变化,脚上动作开始
           function slowWalk() {
               $boy.addClass('slowWalk');
           }
           // 用transition做运动，位移运动开始
           function startRun(options, runTime) {
               var dfdPlay = $.Deferred();
               // 恢复走路
               restoreWalk();
               // 运动的属性
               $boy.transition(
                   options,
                   runTime,
                   'linear',
                   function() {
                       dfdPlay.resolve(); // 动画完成
                   });
               return dfdPlay;
           }
           // 走路动作开始，即脚上动作+位移
           function walkRun(time, distX, distY) {
               time = time || 1000;
               // 脚动作
               slowWalk();
               // 位移动作
               var d1 = startRun({
                   'left': distX + 'px',
                   'top': distY ? distY : undefined
               }, time);
               return d1;
           }
           // 走进商店
           function walkToShop(runTime) {
               var defer = $.Deferred();
               var doorObj = $('.door')
               // 门的坐标
               var offsetDoor = doorObj.offset();
               var doorOffsetLeft = offsetDoor.left;
               var doorOffsetTop = offsetDoor.top;

               /****************************  
               // 小孩当前的坐标  .position()表示相对于父级元素的位移
               var posBoy = $boy.position();
               var boyPoxLeft = posBoy.left;
               var boyPoxTop = posBoy.top;
               ********************************/

               //小男孩当前的坐标  .offset()表示相对于document的当前位置
               var offsetBoy = $boy.offset();
               var boyOffsetLeft = offsetBoy.left;
               var boyOffsetTop = offsetBoy.top;

               /*****************************
               // 中间位置
               var boyMiddle = $boy.width() / 2;
               var doorMiddle = doorObj.width() / 2;
               var doorTopMiddle = doorObj.height() / 2;
               *********************************/

               // 当前需要移动的X方向的距离
               instanceX = (doorOffsetLeft + doorObj.width() / 2) - (boyOffsetLeft + $boy.width() / 2);
               //当前需要移动的Y方向的距离
               //instanceY = (doorOffsetTop + doorObj.height() / 2) - (boyOffsetTop + $boy.height()) ;

               /****************************
               // 当前需要移动的Y方向的距离
               //top = 人物底部的top - 门中见的top值
               instanceY = boyPoxTop + boyHeight - doorOffsetTop + (doorTopMiddle);
               ***********************/

               // 开始走路
               var walkPlay = startRun({
                   transform: 'translateX(' + instanceX + 'px),scale(0.5,0.5)',
                   opacity: 0.1
               }, 2000);
               // 走路完毕
               walkPlay.done(function() {
                   $boy.css({
                       opacity: 0
                   })
                   defer.resolve();
               });
               return defer;
           }

           // 走出店
           function walkOutShop(runTime) {
               var defer = $.Deferred();
               restoreWalk();
               // 开始走路
               var walkPlay = startRun({
                   transform: 'translateX(' + instanceX + 'px),scale(1,1)',
                   opacity: 1
               }, runTime);
               // 走路完毕
               walkPlay.done(function() {
                   defer.resolve();
               });
               return defer;
           }
           // 取花
            function takeFlower() {
            // 增加延时等待效果
            var defer = $.Deferred();
            setTimeout(function() {
                // 取花
                $boy.addClass('slowFlowerWalk');
                defer.resolve();
            }, 2000);
            return defer;
        }

           // 计算移动距离
           function calculateDist(direction, proportion) {
               return (direction == "x" ?
                   visualWidth : visualHeight) * proportion;
           }

           return {
               // 开始走路至某处
               walkTo: function(time, proportionX, proportionY) {
                   var distX = calculateDist('x', proportionX)
                   var distY = calculateDist('y', proportionY)
                   return walkRun(time, distX, distY);
               },
               // 走进商店
               toShop: function() {
                   return walkToShop.apply(null, arguments);
               },
               // 走出商店
               outShop: function() {
                   return walkOutShop.apply(null, arguments);
               },
               // 停止走路
               stopWalk: function() {
                   pauseWalk();
               },
               setColor: function(value) {
                   $boy.css('background-color', value)
               },
               // 获取男孩的宽度
               getWidth: function() {
                   return $boy.width();
               },
               // 复位初始状态
               resetOriginal: function() {
                   this.stopWalk();
                   // 恢复图片
                   $boy.removeClass('slowWalk slowFlolerWalk').addClass('boyOriginal');
               },
               // 转身动作
               rotate: function(callback) {
                   restoreWalk();
                   $boy.addClass('boy_rotate');
                   // 监听转身完毕
                   if (callback) {
                       $boy.on(animationEnd, function() {
                           callback();
                           $(this).off();
                       })
                   }
               },
               // 取花
               takeFlower: function() {
                   return takeFlower();
               }
           }
       }