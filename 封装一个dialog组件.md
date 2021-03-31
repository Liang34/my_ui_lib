### 1.封装一个element-ui风格的dialog组件

前置知识：

1. vue过渡动画
2. sync修饰符
3. 具名插槽与v-slot指令

参数支持：

| **参数名** | 参数描述                         | 参数类型 | 默认值 |
| ---------- | -------------------------------- | -------- | ------ |
| title      | 对话框标题                       | string   | 提示   |
| width      | 宽度                             | string   | 50%    |
| top        | 与顶部的距离                     | string   | 15vh   |
| visible    | 是否显示dialog（支持sync修饰符） | boolean  | false  |

 事件支持： 

| 事件名 | 事件描述       |
| :----- | :------------- |
| opened | 模态框显示事件 |
| closed | 模态框关闭事件 |

 插槽说明： 

| 插槽名称 | 插槽描述           |
| :------- | :----------------- |
| default  | dialog的内容       |
| title    | dialog的标题       |
| footer   | dialog的底部操作区 |

### 2.1dialog组件的基本框架和样式

首先搭建起来dialog组件的框架，暂时不加入插槽，只构建出基本的框架和样式。

框架分为三个部分，头部（header）、内容（body）、底部（footer），基本框架如下：

```vue
<template>
 <div class="one-dialog_wrapper">
   <div class="one-dialog">
     <div class="one-dialog_header">
       <span class="one-dialog_title">提示</span>
       <button class="one-dialog_headerbtn">
         <i class="one-icon-close"></i>
       </button>
     </div>
     <div class="one-dialog_body">
       <span>这是一段信息</span>
     </div>
     <div class="one-dialog_footer">
       <one-button>取消</one-button>
       <one-button type="primary">确定</one-button>
     </div>
   </div>
 </div>
</template>
```

样式：

```css
.one-dialog_wrapper{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 2001;
  background-color: rgba(0,0,0,0.5);
  .one-dialog{
    position: relative;
    margin: 15vh auto 50px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    box-sizing: border-box;
    width: 30%;
    &_header{
      padding: 20px 20px 10px;
      .one-dialog_title{
        line-height: 24px;
        font-size: 18px;
        color: #303133;
      }
      .one-dialog_headerbtn{
        position: absolute;
        top: 20px;
        right: 20px;
        padding: 0;
        background: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        font-size: 16px;
        .one-icon-close{
          color:909399
        }
      }
    }
    &_body{
      padding: 30px 20px;
      color: #606266;
      font-size: 14px;
      word-break: break-all;
    }
    &_footer{
      padding: 10px 20px 20px;
      text-align: right;
      box-sizing: border-box;
      ::v-deep .one-button:first-child{
        margin-right: 20px;
      }
    }
  }
}
```

### 2.2自定义title

```vue
<template>
 <div class="one-dialog_wrapper">
   <div class="one-dialog">
     <div class="one-dialog_header">
       <slot name="title">
         <!-- 将span放到slot内，这样不仅可以定义title文本，还可以定义样式等 -->
        <span class="one-dialog_title">
          {{title}}
        </span>
       </slot>
       <button class="one-dialog_headerbtn">
         <i class="one-icon-close"></i>
       </button>
     </div>
     <div class="one-dialog_body">
       <span>这是一段信息</span>
     </div>
     <div class="one-dialog_footer">
       <one-button>取消</one-button>
       <one-button type="primary">确定</one-button>
     </div>
   </div>
 </div>
</template>
```

### 2.3自定义dialog的宽度和距离顶部的

```vue
<template>
 <div class="one-dialog_wrapper">
   <div class="one-dialog" :style="{width:width,marginTop:top}">
     ···
   </div>
 </div>
</template>
```

### 2.4自定义body内容

body内容可能是除span以外的其他内容，比如列表等，所以在这里使用插，并且在这里使用匿名插槽，使用匿名插槽的好处就是在使用时不需要使用template标签指定内容，直接在组件标签下编写内容即可。

```vue
 <div class="one-dialog_body">
  <slot></slot>
</div>
```

### 2.5自定义footer内容

 footer中使用slot插槽，在父组件中的定义底部内容。 

```vue
<div class="one-dialog_footer">
   <!-- 如果footer不传递内容，则不显示footer -->
   <slot name="footer" v-if="$slots.footer"></slot>
</div>
```

### 2.6dialog的显示与隐藏

 dialog组件的显示与隐藏，需要使用到sync语法糖。这里简单介绍以下什么是sync语法糖，sync通俗来说，是父子组件传值过程中提供的一种模式，这种模式有两个功能：1.将父组件向子组件传值；2.子组件回调一个值给父组件。 

```js
<template v-slot:footer>
  <one-button>取消</one-button>
  <one-button type="primary">确定</one-button>
</template>
```

### 2.7dialog的动画效果

 使用transition包裹一个元素后，这个元素就会被自动添加类名，这部分vuejs文档都有介绍。 

```vue
<template>
  <transition name="dialog-fade">
    <div class="one-dialog_wrapper" v-show="visible" @click.self="handleClose">
        ···
    </div>
  </transition>
</template>
```

```css

.dialog-fade-enter-active{
  animation: fade .3s;
}
.dialog-fade-leave-active{
  animation: fade .3s reverse;
}
@keyframes fade{
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100%{
    opacity: 1;
    transform: translateY(0);
  }
```

