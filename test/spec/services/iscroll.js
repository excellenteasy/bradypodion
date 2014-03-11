describe('bpIscrollProvider', function() {
  var iscroll

  beforeEach(module('bp'))

  beforeEach(module('bp.iscroll'))

  beforeEach(module(function(bpIscrollProvider) {
    bpIscrollProvider.setConfig({
      custom: true
    })
  }))

  beforeEach(inject(function(bpIscroll) {
    iscroll = bpIscroll
  }))

  it('should return custom config', function() {
    expect(iscroll.probeType).toBe(3)
    expect(iscroll.scrollbars).toBe(true)
  })

  it('should return default config', function() {
    expect(iscroll.custom).toBe(true)
  })
})
