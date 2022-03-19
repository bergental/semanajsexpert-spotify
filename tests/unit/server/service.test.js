import {
  jest,
  expect,
  describe,
  test,
  beforeEach
} from '@jest/globals'
import fs from 'fs'
import fsPromises from 'fs/promises'
import config from '../../../server/config.js'
import {
  Service
} from '../../../server/service.js'
import TestUtil from '../_util/testUtil.js'
const {
  dir: {
    publicDirectory
  },
} = config

describe('#Service - ', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  
  test(`ensure Service.getFileInfo is called with the correct value`, async () => {
    const fileName = 'mock.html'
    const mockFileInfo = {
      type: '.html',
      name: `${publicDirectory}\\${fileName}`
    }
    
    jest.spyOn(
      fsPromises,
      fsPromises.access.name
    ).mockResolvedValue()

    jest.spyOn(
      Service.prototype,
      Service.prototype.getFileInfo.name,
    )

    jest.spyOn(
      Service.prototype,
      Service.prototype.createFileStream.name,
    ).mockImplementationOnce((filename) => {
      return null
    })
    
    await new Service().getFileStream(fileName)

    expect(Service.prototype.getFileInfo).toBeCalledWith(fileName)
  })

  test(`ensure Service.createFileStream is called with the correct value`, async () => {
    const fileName = 'mock.html'
    const mockFileInfo = {
      type: '.html',
      name: `${publicDirectory}\\${fileName}`
    }

    jest.spyOn(
      fsPromises,
      fsPromises.access.name
    ).mockResolvedValue()

    jest.spyOn(
      Service.prototype,
      Service.prototype.createFileStream.name,
    ).mockResolvedValue(null)
    
    await new Service().getFileStream(fileName)

    expect(Service.prototype.createFileStream).toBeCalledWith(mockFileInfo.name)
  })
  
  test(`ensure Service.getFileStream returns correct values`, async () => {
    const mockFile = TestUtil.generateReadableStream(['data'])
    const fileName = 'mock.html'
    const mockFileInfo = {
      type: '.html',
      name: `${publicDirectory}\\${fileName}`
    }
    const mockFileStream = {
      stream: mockFile,
      type: mockFileInfo.type
    }
    
    jest.spyOn(
      fsPromises,
      fsPromises.access.name
    ).mockResolvedValue()

    jest.spyOn(
      fs,
      fs.createReadStream.name
    ).mockReturnValue(mockFile)
    
    const fileStream = await new Service().getFileStream(fileName)
    expect(fileStream.type).toStrictEqual(mockFileStream.type)
    expect(fileStream.stream).toStrictEqual(mockFileStream.stream)
  })

  describe('exceptions', () => {
    test(`should throw if Service.getFileInfo throws`, async () => {
      const fileName = 'mock.html'
      jest.spyOn(
        Service.prototype,
        Service.prototype.getFileInfo.name,
      ).mockImplementation(() => { throw new Error() })
      
      const promise = new Service().getFileStream(fileName)
  
      await expect(promise).rejects.toThrow()
    })

    test(`should throw if Service.createFileStream throws`, async () => {
      const fileName = 'mock.html'
      jest.spyOn(
        Service.prototype,
        Service.prototype.createFileStream.name,
      ).mockImplementation(() => { throw new Error() })
      
      const promise = new Service().getFileStream(fileName)
  
      await expect(promise).rejects.toThrow()
    })
  })
})
