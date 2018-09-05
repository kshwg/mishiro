import * as packager from 'electron-packager'
import * as path from 'path'
import * as fs from 'fs-extra'
import { execSync } from 'child_process'
import * as pkg from '../package.json'
import { prod } from './webpack'
import { ilog, wlog, elog } from './rainbow'
// import { zip } from 'zauz'
import { productionPackage, packagerOptions, arch } from './packager.config'

function bundleProductionCode () {
  ilog(`[${new Date().toLocaleString()}] Bundle production code...`)
  return prod()
}

function packageApp () {
  process.stdout.write(`[${new Date().toLocaleString()}] `)
  return packager(packagerOptions)
}

function writePackageJson (root: string) {
  return fs.writeJson(path.join(root, 'package.json'), productionPackage)
}

function copyExtra (root: string) {
  return Promise.all([
    path.join(__dirname, '../../asset/bgm'),
    path.join(__dirname, '../../asset/icon')
  ].map(p => fs.copy(p, path.join(root, '../asset', path.basename(p)))))
}

async function rename (appPath: string) {
  let dirName: string | string[] = path.basename(appPath).split('-')
  dirName.splice(1, 0, `v${pkg.version}`)
  dirName = dirName.join('-')
  const newPath = path.join(path.dirname(appPath), dirName)
  if (fs.existsSync(newPath)) {
    wlog(`[${new Date().toLocaleString()}] Overwriting... `)
    await fs.remove(newPath)
  }
  await fs.rename(appPath, newPath)
  return newPath
}

/* function zipApp (p: string) {
  ilog(`[${new Date().toLocaleString()}] Zip ${p}`)
  return zip(p, p + '.zip')
} */

async function main () {
  const start = new Date().getTime()
  // await reInstall()
  await bundleProductionCode()
  const [appPath] = await packageApp()
  const root = process.platform === 'darwin' ? path.join(appPath, 'mishiro.app/Contents/Resources/app') : path.join(appPath, 'resources/app')
  await writePackageJson(root)
  if (process.argv.slice(2)[1] === 'install') {
    execSync(`npm install --production --arch=${arch} --target_arch=${arch} --build-from-source --runtime=electron --target=2.0.5 --dist-url=https://atom.io/download/electron`, { cwd: root, stdio: 'inherit' })
  }
  await copyExtra(root)
  await rename(appPath)
  // const size = await zipApp(newPath)
  // ilog(`[${new Date().toLocaleString()}] Size: ${size} Bytes`)
  return (new Date().getTime() - start) / 1000
}

main().then(s => console.log(`\n  Done in ${s} seconds.`)).catch(e => elog(e))