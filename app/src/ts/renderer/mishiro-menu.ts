import { remote } from 'electron'
import { Vue, Component, Prop } from 'vue-property-decorator'
import * as marked from 'marked'
import getPath, { dataDir } from '../common/get-path'
import fs from './fs-extra'

@Component
export default class extends Vue {
  @Prop() resVer: string | number

  showOption (btn: HTMLElement) {
    btn.blur()
    this.playSe(this.enterSe)
    this.event.$emit('option')
  }
  showAbout () {
    this.playSe(this.enterSe)
    this.event.$emit('showAbout')
  }
  async showLicense () {
    this.playSe(this.enterSe)
    this.event.$emit('license')
    this.event.$emit('alert', this.$t('menu.license'), marked(await fs.readFile(getPath('./public/LICENSE.md'), 'utf8')), 900)
  }
  showVar () {
    this.playSe(this.enterSe)
    this.event.$emit('alert', this.$t('menu.var'), this.$t('menu.varCon'))
  }
  update () {
    this.playSe(this.enterSe)
    if (!navigator.onLine) {
      this.event.$emit('alert', this.$t('home.errorTitle'), this.$t('home.noNetwork'))
      return
    }
    this.$emit('checking')

    const headers = {
      'User-Agent': 'mishiro'
    }
    const releases = {
      url: 'https://api.github.com/repos/toyobayashi/mishiro/releases',
      json: true,
      headers
    }
    const tags = {
      url: 'https://api.github.com/repos/toyobayashi/mishiro/tags',
      json: true,
      headers
    }
    this.core.util.request(releases, (err, _res, body) => {
      if (!err) {
        const latest = body[0]
        const version = latest.tag_name.substr(1)
        if (remote.app.getVersion() >= version) {
          this.$emit('checked')
          this.event.$emit('alert', this.$t('menu.update'), this.$t('menu.noUpdate'))
        } else {
          const description = marked(latest.body)
          const zip = latest.assets.filter((a: any) => ((a.content_type === 'application/x-zip-compressed' || a.content_type === 'application/zip') && (a.name.indexOf(`${process.platform}-${process.arch}`) !== -1)))[0]
          const exe = latest.assets.filter((a: any) => ((a.content_type === 'application/x-msdownload') && (a.name.indexOf(`${process.platform}-${process.arch}`) !== -1)))[0]
          const patch = latest.assets.filter((a: any) => (a.name.indexOf('patch.zip') !== -1))[0]
          const zipUrl = zip ? zip.browser_download_url : null
          const exeUrl = exe ? exe.browser_download_url : null
          const patchUrl = patch ? patch.browser_download_url : null

          this.core.util.request(tags, (err, _res, body) => {
            this.$emit('checked')
            if (!err) {
              const latestTag = body.filter((tag: any) => tag.name === latest.tag_name)[0]
              const commit = latestTag.commit.sha
              const versionData = { version, commit, description, zipUrl, exeUrl, patchUrl }
              console.log(versionData)
              this.event.$emit('versionCheck', versionData)
            } else {
              this.event.$emit('alert', this.$t('home.errorTitle'), err.message)
            }
          })
        }
      } else {
        this.event.$emit('alert', this.$t('home.errorTitle'), err.message)
      }
    })
  }
  relaunch () {
    this.playSe(this.enterSe)
    remote.app.relaunch({ args: ['.'] })
    remote.app.exit(0)
  }
  calculator () {
    this.playSe(this.enterSe)
    this.event.$emit('openCal')
  }
  exit () {
    remote.app.exit(0)
    this.playSe(this.cancelSe)
  }
  async cacheClear () {
    this.playSe(this.enterSe)
    const files = fs.readdirSync(dataDir())
    const deleteItem = []
    for (let i = 0; i < files.length; i++) {
      if (!new RegExp(`${this.resVer}`).test(files[i])) deleteItem.push(dataDir(files[i]))
    }
    if (deleteItem.length) {
      Promise.all(deleteItem.map(item => fs.remove(item))).then(() => {
        this.event.$emit('alert', this.$t('menu.cacheClear'), this.$t('menu.cacheClearSuccess'))
      })
    } else this.event.$emit('alert', this.$t('menu.cacheClear'), this.$t('menu.noCache'))
  }

}