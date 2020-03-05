<<<<<<< HEAD
import { invoke } from 'uni-core/service/bridge'
/**
 * 打开文档
 * @param {String} filePath 打开文件路径
 * * @param {String} fileType 打开文件路径 有效值 doc, xls, ppt, pdf, docx, xlsx, pptx
 * @param {*} callbackId
 */
export function openDocument ({
  filePath,
  fileType
}, callbackId) {
  if ('doc/xls/ppt/pdf/docx/xlsx/pptx'.indexOf(fileType) !== -1 && filePath) {
    const {
      invokeCallbackHandler: invoke
    } = UniServiceJSBridge
    foxsdk.runtime.openFile(filePath, ret => {
      invoke(callbackId, {
        errMsg: 'openDocument:ok'
      })
    })
  } else {
    invoke(callbackId, {
      errMsg: 'openDocument:fail' +
          ('doc/xls/ppt/pdf/docx/xlsx/pptx'.indexOf(fileType) !== -1
            ? 'fileType arguments must be "doc, xls, ppt, pdf, docx, xlsx, pptx".'
            : !filePath ? 'filePath arguments must be passed.' : '')
    })
  }
}
=======
import { invoke } from 'uni-core/service/bridge'
/**
 * 打开文档
 * @param {String} filePath 打开文件路径
 * * @param {String} fileType 打开文件路径 有效值 doc, xls, ppt, pdf, docx, xlsx, pptx
 * @param {*} callbackId
 */
export function openDocument ({
  filePath,
  fileType
}, callbackId) {
  if ('doc/xls/ppt/pdf/docx/xlsx/pptx'.indexOf(fileType) !== -1 && filePath) {
    const {
      invokeCallbackHandler: invoke
    } = UniServiceJSBridge
    foxsdk.runtime.openFile(filePath, ret => {
      invoke(callbackId, {
        errMsg: 'openDocument:ok'
      })
    })
  } else {
    invoke(callbackId, {
      errMsg: 'openDocument:fail' +
          ('doc/xls/ppt/pdf/docx/xlsx/pptx'.indexOf(fileType) !== -1
            ? 'fileType arguments must be "doc, xls, ppt, pdf, docx, xlsx, pptx".'
            : !filePath ? 'filePath arguments must be passed.' : '')
    })
  }
}
>>>>>>> ad6e88a9d85a46c17ad495b0332e8189b3ad3ac3
