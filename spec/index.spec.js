describe('Pid', () => {
  const { create, compact, simple, toUuid, computeLengthFromBase } = require('../lib/index')

  beforeEach(function () {

  })

  it(`should be able to convert from UUID to PID and back to UUID in multiple bases`, () => {
    const bases = [64, 36, 10, 2]
    const uuids = [
      'ffffffff-ffff-ffff-ffff-ffffffffffff',
      '00000000-0000-0000-0000-000000000000',
      '528f4e50-1f26-4067-8c9d-8475a0da3e16',
      '275c7d5b-ec7b-4a04-afe0-00e7602747e2',
      'e84d040d-5260-4646-bda3-56161f62525e',
      '52cf29d6-2b61-4c9d-abaf-9d1e7d676acd',
      'f0f64bda-9afe-4443-a0aa-a74298a1e4d1',
      'a20a37aa-6a2d-47b3-ad77-56a289e52a8a',
      'd927d185-2214-4782-8699-6abb136880af',
      '1e17729d-3fdd-4bec-8562-d514da77cff5'
    ]

    bases.forEach(base => {
      const length = computeLengthFromBase(base)
      uuids.forEach(uuid => {
        const pid = create({ uuid, base })
        const inverse = toUuid(pid, base)
        expect(pid.length).toEqual(length)
        expect(inverse.length).toEqual(36)
        expect(uuid).toEqual(inverse)
      })
    })

  })

  it(`should be able to convert from PID to UUID and back to PID in multiple bases`, () => {
    const bases = [64, 36]
    const pids = {
      36: [
        'f5lxx1zz5pnorynqglhzmsp33',
        '0000000000000000000000000',
        'abcd123efgh456ijkl789mnop'
      ],
      64: [
        '3_____________________',
        '0000000000000000000000',
        '2'.repeat(22),

      ]
    }

    bases.forEach(base => {
      const length = computeLengthFromBase(base)
      pids[base].forEach(pid => {
        const uuid = toUuid(pid, base)
        const inverse = create({ uuid, base })
        expect(uuid.length).toEqual(36)
        expect(inverse.length).toEqual(length)
        expect(pid).toEqual(inverse)
      })
    })
  })

  it(`should be able to call 'compact' and get a pid with length 22`, () => {
    const uuids = [
      'ffffffff-ffff-ffff-ffff-ffffffffffff',
      '00000000-0000-0000-0000-000000000000',
      '528f4e50-1f26-4067-8c9d-8475a0da3e16',
      '275c7d5b-ec7b-4a04-afe0-00e7602747e2',
      'e84d040d-5260-4646-bda3-56161f62525e',
      '52cf29d6-2b61-4c9d-abaf-9d1e7d676acd',
      'f0f64bda-9afe-4443-a0aa-a74298a1e4d1',
      'a20a37aa-6a2d-47b3-ad77-56a289e52a8a',
      'd927d185-2214-4782-8699-6abb136880af',
      '1e17729d-3fdd-4bec-8562-d514da77cff5'
    ]
    uuids.forEach(uuid => expect(compact(uuid).length).toEqual(22))
  })

  it(`should be able to call 'simple' and get a pid with length 25`, () => {
    const uuids = [
      'ffffffff-ffff-ffff-ffff-ffffffffffff',
      '00000000-0000-0000-0000-000000000000',
      '528f4e50-1f26-4067-8c9d-8475a0da3e16',
      '275c7d5b-ec7b-4a04-afe0-00e7602747e2',
      'e84d040d-5260-4646-bda3-56161f62525e',
      '52cf29d6-2b61-4c9d-abaf-9d1e7d676acd',
      'f0f64bda-9afe-4443-a0aa-a74298a1e4d1',
      'a20a37aa-6a2d-47b3-ad77-56a289e52a8a',
      'd927d185-2214-4782-8699-6abb136880af',
      '1e17729d-3fdd-4bec-8562-d514da77cff5'
    ]
    uuids.forEach(uuid => expect(simple(uuid).length).toEqual(25))
  })

})
