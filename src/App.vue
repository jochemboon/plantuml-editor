<template>
  <div id="editor-container" class="editor-container">
    <MonacoEditor class="editor" v-model="code" @editorDidMount="editorDidMount"/>
    <div id="viewer" class="viewer">
      <img id="viewer-image" class="viewer-image" src="">
    </div>
  </div>
</template>
<script>
import MonacoEditor from 'vue-monaco'
import * as Synchro from './js/synchro2.min'
import * as Encoder from './js/encoder'

export default {
  name: 'App',
  components: {
    MonacoEditor
  },
  methods:{
    editorDidMount(editor) {
      // eslint-disable-next-line no-unused-vars
      editor.onDidChangeModelContent(e =>{
        // Convert user input to PlantUML API string format
        var userInput = editor.getValue();
        var plantUmlString = buildPlantumlString(userInput)

        // Call PlantUML API
        console.log(plantUmlString)

        let headers = {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
        };

        let response = fetch(`https://www.plantuml.com/plantuml/svg/${plantUmlString}`, headers)
        response.then(r => {
          console.log(r)
          if (r.status == 200) {
            let embedElement = document.getElementById('viewer-image')
            embedElement.setAttribute('src', r.url)
            embedElement.contentDocument.location.reload()
          }
        });

        // Draw SVG from API
      })
    }
  },
  data() {
    return {
      code: 'class Foo {\n' +
          '    +void Bar()\n' +
          '    -string bar\n' +
          '}'
    }
  }
}

function buildPlantumlString(userInput) {
  let compressedContent = compress(userInput);
  let encodedContent = Encoder.encode64_(compressedContent)

  return encodedContent;
}

function compress(s) {
  s = unescape(encodeURIComponent(s));
  let arr = [];

  for (let i = 0; i < s.length; i++) {
    arr.push(s.charCodeAt(i));
  }
  let compressor = new Synchro.Zopfli.RawDeflate(arr);
  let compressed = compressor.compress();
  return compressed
}

</script>

<style>
.editor-container {
  display: block;
}

.editor {
  width: 50%;
  height: 800px;
  float: left;
}

.viewer {
  width: 50%;
  height: 800px;
  float: right;
}

.viewer-image {
  width: 100%;
  margin: 0 auto;
}
</style>
