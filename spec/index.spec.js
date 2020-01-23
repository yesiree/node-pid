describe('Pid', () => {
  const { createPid, compactPid, simplePid, pidToUuid, computeLengthFromBase } = require('../lib/index')
  // beforeEach(function () { })

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
        const pid = createPid({ uuid, base })
        const inverse = pidToUuid(pid, base)
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
        const uuid = pidToUuid(pid, base)
        const inverse = createPid({ uuid, base })
        expect(uuid.length).toEqual(36)
        expect(inverse.length).toEqual(length)
        expect(pid).toEqual(inverse)
      })
    })
  })

  it(`should be able to call createPid() with any combination of parameters`, () => {
    const base = 36
    const uuid = '528f4e50-1f26-4067-8c9d-8475a0da3e16'
    const pids = [
      { pid: createPid(), base: 64, uuid: null },
      { pid: createPid(uuid), base: 64, uuid },
      { pid: createPid({ uuid }), base: 64, uuid },
      { pid: createPid({ uuid, base }), base, uuid },
      { pid: createPid({ base }), base, uuid: null }
    ]
    pids.forEach(data => {
      const { pid, base, uuid } = data
      const length = computeLengthFromBase(base)
      expect(pid.length).toEqual(length)
      if (uuid) {
        expect(pidToUuid(pid, base)).toEqual(uuid)
      }
    })
  })

  it(`should be able to call 'compact' and get a PID with length 22`, () => {
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
    uuids.forEach(uuid => expect(compactPid(uuid).length).toEqual(22))
  })

  it(`should be able to call 'simple' and get a PID with length 25`, () => {
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
    uuids.forEach(uuid => expect(simplePid(uuid).length).toEqual(25))
  })

  it(`should throw an error if createPid is called with a base smaller than 2 or greater than 64`, () => {
    expect(() => {
      createPid({ base: 65 })
    }).toThrowError('Invalid base: 65. Must be between 2 and 64.')

    expect(() => {
      createPid({ base: 1 })
    }).toThrowError('Invalid base: 1. Must be between 2 and 64.')

  })

  it(`should throw an error if pidToUuid is called with a PID that exceeds the maximum value for a given base`, () => {
    const invalidPid = 'f3f3f3f3f3f3f3f3f3f3f3f3f3'
    expect(() => {
      pidToUuid(invalidPid, 64)
    }).toThrowError(`Invalid PID '${invalidPid}'. Maximum PID value using base '64' is '3_____________________'.`)
  })

  it(`should throw an error if either parameter to pidToUuid is invalid`, () => {
    expect(() => {
      pidToUuid()
    }).toThrowError(`Must provide non-empty string for pid parameter. Found 'undefined' (undefined).`)

    expect(() => {
      pidToUuid('')
    }).toThrowError(`Must provide non-empty string for pid parameter. Found '' (string).`)

    expect(() => {
      pidToUuid('abcd123efgh456ijkl789mnop')
    }).toThrowError(`Must provide number between 2 and 64 for base parameter. Found 'undefined'.`)

    expect(() => {
      pidToUuid('abcd123efgh456ijkl789mnop', 1)
    }).toThrowError(`Must provide number between 2 and 64 for base parameter. Found '1'.`)

    expect(() => {
      pidToUuid('abcd123efgh456ijkl789mnop', 65)
    }).toThrowError(`Must provide number between 2 and 64 for base parameter. Found '65'.`)

  })

})
