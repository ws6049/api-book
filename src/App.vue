 <template>
  <div id="app" class="layout">
    <!-- header start -->
    <Header
      :style="{background: '#515a6e', zIndex: 9999,top: 0, height: '48px', position: 'fixed', width: '100%',left: 0}"
    >
      <div class="project-name">{{project}}</div>
    </Header>
    <!-- header end -->

    <!-- leftbar start -->
    <Sider
      v-model="isCollapsed"
      ref="sider"
      :style="{position: 'fixed', height: 'calc(100% - 48px)', top: '48px', left: 0, overflowX: 'hidden', overflowY: 'auto',background: '#ffffff'}"
    >
      <Menu accordion theme="light" width="auto" @on-open-change="open" @on-select="select">
        <Submenu :key="i" v-for="item,i in menuList()" :name="i">
          <template slot="title">
            <Icon :type="item.icon"></Icon>
            {{item.displayName}}
          </template>
          <MenuItem
            :key="j"
            :name="'#' + child.displayName.substring(0) "
            v-for="child,j in item.children"
          >{{child.displayName }}</MenuItem>
        </Submenu>
      </Menu>
    </Sider>
    <!-- leftbar end -->

    <Layout :style="{marginLeft: '200px'}">
      <Content :style="{  marginTop: '48px', height: 'auto'}">
        <Card
          :bordered="false"
          dis-hover
          class="card"
          style="width: 100%;margin-bottom: 40px;"
          v-if="target.model !== ''"
        >
          <div>
            <p class="title">
              <span v-if="target.name" v-html="target.name"></span>
              <span v-if="target.name">&nbsp;-&nbsp;</span>
              <span v-html="target.model"></span>
              <div v-if="target.comment" v-html="target.comment"></div>
            </p>
            <pre v-highlightjs><code class="json" v-html="target.path"></code></pre>
            <ul>
              <li :key="i" v-for="item,i in target.methods">
                <span :id="item.path.substring(0)">
                  <span class="methodType post" v-text="'POST'"></span>
                  <pre v-highlightjs><code class="json path" v-html="item.path"></code></pre>
                </span>
                <div v-if="item.comment">
                  Comment
                  <div style="margin-top: 10px;" v-html="item.comment"></div>
                </div>
                <div>
                  Request Parameter
                  <table class="simple-table" v-if=" item.parameters.fields.length !== 0">
                    <tr>
                      <th>Index</th>
                      <th>Key</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Sample</th>
                      <th>Comment</th>
                    </tr>
                    <tr :key="k" v-for="p,k in item.parameters.fields">
                      <td>{{p.index}}</td>
                      <td>{{p.name}}</td>
                      <td>{{p.alias}}</td>
                      <td>{{p.type}}</td>
                      <td v-if="p.fields.length === 0">{{p.sample}}</td>
                      <td v-if="p.fields.length !== 0">
                        <a @click="check(p.fields)">more</a>
                      </td>
                      <td>{{p.comment}}</td>
                    </tr>
                  </table>
                </div>
                <div class="example">
                  <div>Request-Sample</div>
                </div>
                <pre v-if="!!item.parameters.sample" v-highlightjs><code class="json" v-html="item.parameters.sample"></code></pre>
                <pre v-else v-highlightjs><code class="json">&nbsp;</code></pre>
                <div>
                  Response Parameter
                  <table class="simple-table" v-if=" item.returnType.fields.length !== 0">
                    <tr>
                      <th width="20%">Key</th>
                      <th width="20%">Name</th>
                      <th width="20%">Type</th>
                      <th width="20%">Sample</th>
                      <th width="20%">Comment</th>
                    </tr>
                    <tr :key="k" v-for="p,k in item.returnType.fields">
                      <td>{{p.name}}</td>
                      <td>{{p.alias}}</td>
                      <td>{{p.type}}</td>
                      <td>{{p.sample}}</td>
                      <td>{{p.comment}}</td>
                    </tr>
                  </table>
                </div>
                <div class="example">
                  <div>Response-Sample</div>
                </div>
                <pre v-if="item.returnType.sample" v-highlightjs><code class="json" v-html="item.returnType.sample"></code></pre>
                <pre v-else v-highlightjs><code class="json">&nbsp;</code></pre>
              </li>
            </ul>
          </div>
        </Card>
      </Content>
    </Layout>

    <!-- footer start -->
    <Footer
      :style="{marginLeft: '200px', position: 'fixed',bottom: 0, height: '40px',    lineHeight: '40px',padding:' 0 0 0 20px', width: '100%'}"
      class="layout-footer-center"
    >{{time}} &copy; {{project}} Team</Footer>
    <!-- footer end -->
  </div>
</template> 
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import axios from "axios";
@Component
export default class Book extends Vue {
  isCollapsed: boolean = false;
  project: string = "";
  time: string = "";
  target: object = {
    comment: "",
    methods: [],
    model: "",
    path: "",
    name: ""
  };
  defaultTarget: object = {
    comment: "",
    methods: [],
    model: "",
    path: "",
    name: ""
  };
  apiJson: any = [];
  open(e: any): void {
    if (e.length === 0) return;
    let idx = parseInt(e);
    let apiJson = this.apiJson[idx];
    this.target = JSON.parse(JSON.stringify(this.defaultTarget));
    this.target = {
      name: apiJson.name || "",
      comment: apiJson.comment || "",
      methods: apiJson.methods || [],
      model: apiJson.model || "",
      path: apiJson.path || ""
    };
    document.documentElement.scrollTop = 0;
  }
  check(fields: any): void {
    let html = `<table class="simple-table">
                    <tr> 
                      <th>健</th>
                      <th>名称</th>
                      <th>类型</th>
                      <th>例子</th>
                      <th>备注</th> 
                    </tr> `;
    fields.map((field: any) => {
      html += `<tr><td>${field.alias}</td><td>${field.name}</td><td>${
        field.type
      }</td><td>${field.sample}</td><td>${field.comment}</td></tr>`;
    });
    html += `</table>`;
    this.$Modal.info({
      width: 800,
      title: "参数详情",
      content: html
    });
  }
  select(e: any): void {
    this.goAnchor(e);
  }
  menuList(): any {
    let arr = [];
    for (let i in this.apiJson) {
      let child = [];
      let methods = this.apiJson[i].methods;
      for (let j = 0; j < methods.length; j++) {
        child.push({
          displayName: methods[j].path
        });
      }
      arr.push({
        displayName: this.apiJson[i].name || this.apiJson[i].model,
        children: child
      });
    }
    return arr;
  }
  collapsedSider(): void {
    // this.$refs.sider.toggleCollapse();
  }
  rotateIcon(): any {
    return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
  }
  goAnchor(selector: any): void {
    document.documentElement.scrollTop = this.$el.querySelector(
      selector
    ).offsetTop;
    // this.$el.querySelector(selector).scrollIntoView();
  }
  menuitemClasses(): any {
    return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
  }
  mounted() {
    this.time = new Date().getFullYear().toString();
    axios.post("/doc/api", {}).then(res => {
      this.project = res.data.project;
      document.title = res.data.project;
      this.apiJson = res.data.services;
    });
  }
}
</script> 
<style lang="less">
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  text-align: left;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}

.project-name {
  color: #ffffff;
  line-height: 48px;
  font-size: 20px;
  font-family: "Dosis", "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  font-weight: 500;
  small {
    font-size: 12px;
  }
}

.card {
  .title,
  .text,
  .sub-text,
  .comment {
    font-size: 22px;
    margin-bottom: 10px;
    font-weight: 600;
    margin-top: 40px;
  }
  .comment {
    display: inline;
  }
  .title {
    margin-top: 0px;
    margin-bottom: 20px;
  }
  .sub-text {
    margin-top: 0px;
  }
  ul {
    list-style-type: none;
    margin-top: 50px;
    li {
      font-size: 18px;
      margin-bottom: 60px;
      div {
        margin-bottom: 30px;
      }
      .mark {
        display: inline-block;
        width: 100%;
        font-size: 20px;
        color: #42b983;
        margin: 10px 20px 20px 0px;
      }
      .methodType {
        font-size: 12px;
        color: #ffffff;
        display: inline-block;
        background-color: #087613;
        border-radius: 4px;
        padding: 4px;
        margin-bottom: -440px;
        .get {
          background-color: #087613;
        }
        .post {
          background-color: #42b983;
        }
      }
      pre {
        margin-top: 10px;
      }
      .example {
        border-bottom: solid 1px #e1e1e1;
        margin-bottom: 0px !important;
        height: 40px;
        position: relative;
        div {
          position: absolute;
          font-size: 14px;
          bottom: -1px;
          height: 100%;
          line-height: 40px;
          border: solid 1px #e1e1e1;
          display: inline-block;
          border-top-left-radius: 3px;
          border-top-right-radius: 3px;
          border-bottom: solid 1px #ffffff;
          padding: 0 20px;
          margin-bottom: 0px !important;
        }
      }
    }
  }
}
.ivu-menu-vertical.ivu-menu-light:after {
  width: 0;
}

// 模态框(confirm)padding-left设置为0
.ivu-modal-confirm-body {
  padding-left: 0px !important;
}

.ivu-menu-submenu-title-icon {
  width: 12px;
  height: 16px;
  background-image: url(./assets/arrow.png);
  background-repeat: no-repeat;
  background-size: contain;
  &::before {
    content: "" !important;
  }
}

.simple-table {
  border-collapse: collapse;
  border-spacing: 0;
  vertical-align: top;
  margin-top: 20px;
  width: 100%;
  th,
  td {
    font-size: 15px;
    font-weight: 500;
    padding: 4px 10px;
    text-align: center;
    border: solid 1px #e1e1e1;
  }
  th {
    background-color: #f7f7f7;
  }
}

code {
  border-radius: 6px;
  font-size: 14px !important;
  &.path,
  &.path span {
    font-weight: normal !important;
    font-size: 20px !important;
    color: #dd1144 !important;
  }
}
</style>
