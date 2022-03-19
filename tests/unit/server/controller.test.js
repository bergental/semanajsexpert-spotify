import {
  jest,
  expect,
  describe,
  test,
  beforeEach
} from '@jest/globals'
import {
  Service
} from '../../../server/service.js'
import {
  Controller
} from '../../../server/controller.js'
import TestUtil from '../_util/testUtil.js'

describe('#Controller', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  test(`ensure Service.getFileStream is called with the correct value`, async () => {
    const mockFile = TestUtil.generateReadableStream(['data'])
    const fileName = 'mock.html'
    const mockFileStream = {
      stream: mockFile,
      type: '.html'
    }

    jest.spyOn(
      Service.prototype,
      Service.prototype.getFileStream.name,
    ).mockResolvedValue(mockFileStream)
    
    await new Controller().getFileStream(fileName)

    expect(Service.prototype.getFileStream).toBeCalledWith(fileName)
  })

  test(`ensure Controller.getFileStream returns correct values`, async () => {
    const mockFile = TestUtil.generateReadableStream(['data'])
    const fileName = 'mock.html'
    const mockFileStream = {
      stream: mockFile,
      type: '.html'
    }

    jest.spyOn(
      Service.prototype,
      Service.prototype.getFileStream.name,
    ).mockResolvedValue(mockFileStream)
    
    const result = await new Controller().getFileStream(fileName)

    expect(result.type).toStrictEqual(mockFileStream.type)
    expect(result.stream).toStrictEqual(mockFile)
  })

  describe('exceptions', () => {
    test(`should throw if Service.getFileStream throws`, async () => {
      const fileName = 'mock.html'
      jest.spyOn(
        Service.prototype,
        Service.prototype.getFileStream.name,
      ).mockImplementation(() => { throw new Error() })
      
      const promise = new Controller().getFileStream(fileName)
  
      await expect(promise).rejects.toThrow()
    })
  })
})
