<template>
  <span>
    <input multiple='mutiple' :accept="accept" @change="sendFileData" ref='mutipleFile' v-show="false" type="file" >
    <input  :accept="accept" @change="sendFileData" ref='singleFile' v-show="false" type="file" >
    <span @click='chooseFile'>
      <slot>
        <el-button plain="plain" :size='size'  type="primary">{{text}}</el-button>
      </slot>
    </span>

  </span>
</template>

<script>
  export default{
    props:{
      text:{
        type:String,
        default:'导入'
      },
      type:{
        type:String,
        default:'primary'
      },
      accept:{
        type:String,
        default:'.xlsx,xls'
      },
      size:{
        type:String,
        default:'mini'
      },
      plain:{
        type:Boolean,
        default:false
      },
      isMutiple:{
        type:Boolean,
        default:false
      }

    },
    methods:{
      chooseFile(){
        let inp=this.isMutiple?'mutipleFile':'singleFile';
        this.$refs[inp].click();
      },
      sendFileData(){
        let inp=this.isMutiple?'mutipleFile':'singleFile'
        let fileData=this.$refs[inp].files
        if(this.isMutiple){
          let arr=[];
          for(var i=0;i<fileData.length;i++){
            console.log(fileData[i])
            arr[i]=fileData[i]
          }
          this.$emit('getFileData',arr)
        }else{
          this.$emit('getFileData',fileData[0])
        }
      }
    }

  }
</script>

<style>
</style>
