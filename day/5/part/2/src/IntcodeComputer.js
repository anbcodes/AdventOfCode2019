const Program = require('./Program')
const $ = require('./Colors')
const readLine = require('readline-sync')

module.exports = class IntcodeComputer {
  constructor(opcodes) {
    this.currentColor = $.r
    this.Program = new Program()
    this.Program.on(1, this.onAdd.bind(this), 3)
    this.Program.on(2, this.onMul.bind(this), 3)
    this.Program.on(3, this.onInput.bind(this), 1)
    this.Program.on(4, this.onOutput.bind(this), 1)
    this.Program.on(5, this.onJumpIfTrue.bind(this), 2)
    this.Program.on(6, this.onJumpIfFalse.bind(this), 2)
    this.Program.on(7, this.onIsLessThen.bind(this), 3)
    this.Program.on(8, this.onIsEqualTo.bind(this), 3)


    this.Program.on(99, () => opcodes.length + 1, 1)

    this.Program.run(opcodes)
  }

  onAdd({ opcodes, index }, addend1, addend2, resultPos) {
    opcodes[resultPos.ref] = addend1.value + addend2.value
    return index + 4

  }

  onMul({ opcodes, index }, factor1, factor2, resultPos) {
    opcodes[resultPos.ref] = factor1.value * factor2.value

    return index + 4
  }

  onOutput({ opcodes, index }, value) {
    console.log(this.currentColor + String(value.value) + $.e)

    this.currentColor = this.currentColor === $.r ? $.g : $.r

    return index + 2
  }

  onInput({ opcodes, index }, toWrite) {
    process.stdout.write(this.currentColor)    
    let value = +readLine.question('Input: ')
    process.stdout.write($.e)    

    opcodes[toWrite.ref] = value

    this.currentColor = this.currentColor === $.r ? $.g : $.r

    return index + 2
  }

  onJumpIfTrue({ opcodes, index }, value, jumpPos) {
    if (value.value !== 0) {
      return jumpPos.value
    } else {
      return index + 3
    }
  }

  onJumpIfFalse({ opcodes, index }, value, jumpPos) {
    if (value.value === 0) {
      return jumpPos.value
    } else {
      return index + 3
    }
  }

  onIsLessThen({ opcodes, index }, n1, n2, output) {
    if (n1.value < n2.value) {
      opcodes[output.ref] = 1
    } else {
      opcodes[output.ref] = 0
    }
    return index + 4
  }

  onIsEqualTo({ opcodes, index }, n1, n2, output) {
    if (n1.value === n2.value) {
      opcodes[output.ref] = 1
    } else {
      opcodes[output.ref] = 0
    }
    return index + 4
  }
}