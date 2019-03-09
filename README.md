# PID

> A module for generating universally-unique, _public_ IDs

## Installation

```
npm i @yesiree/pid
```

## Usage

**NodeJS**
```
const pid = require('@yesiree/pid')
const p = pid.create()
```

**Browser**
```
pid.create()
```

## A brief explanation of purpose

When multiple systems exchange data (such as a public API), it's often necessary to have unique IDs with which to identify that data. Sharing IDs generated in and used internally by a database is usually a bad idea. If the storage mechanism needs to change, the IDs may neeed to change as well. This would require that any system consuming that data would also have to update all references to those IDs. If these systems exist within different organizations, this may not be feasible. Even if the systems exist within the same organization, the effort required to make these changes could be enormous.

Even if it is not anticipated that the storage mechanism will change, sometimes the most optimal ID format for the storage mechanism will not provide enough uniqueness to prevent collisions in the systems consuming data. For example, assume that you are building a system that pulls data from multiple APIs. You use the IDs given by those APIs to identify the data. Now assume that those APIs all use an auto-incrementing integer ID. It's inevitable that IDs from one of those APIs will collide with IDs from another. If the APIs used auto-incrementing integer IDs internally, but used universally unique IDs externally, there would no be concern for collision.

For these reasons and others, it's often best to have two IDs for each piece of data: one used internally by the storage mechanism that can change as needed and one exposed externally to other systems consuming the data. The external ID should be globally unique (to all systems). UUIDs or GUIDs are often used for this purpose, but they tend to be long and ugly. When used in web applications, for example, they tend to fill up the address bar and make it less human-readable.

This library guarantees the same level of uniqueness, but in a more compact form. This is accomplished by generating UUIDs and then converting them to a different base that can be representated in fewer characters.
