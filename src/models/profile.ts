import mongoose, { Schema, Document } from 'mongoose'
import { USER_TABLE } from './user'

export const PROFILE_TABLE = 'Profile'
export enum Gender {
  male = 'Male',
  female = 'Female',
  unknown = 'Unknown'
}
export enum Proficiency {
  beginer = 'Beginer',
  intermediate = 'Intermediate',
  expert = 'expert'
}
export interface Language {
  code: string
  name: string
  options: {
    read: boolean
    write: boolean
    speak: boolean
  }[]
}
export interface Social {
  youtube: string
  twitter: string
  facebook: string
  linkedin: string
  instagram: string
}
export interface Skill {
  language: string
  rating: number
}

export interface Project {
  name: string // vue-social
  role: string // developer
  duration: string // 1 year
  frontendIn: string // react
  backendIn: string // nodejs
  teamSize?: number // 5
  database?: string // mongodb
  cssOrFramework?: string // tailwind css
  helperTechnologies?: [string] // [pinia, vue-router, vueuse]
  projectUrl?: string // http://vue-social.com
}
export interface Employment {
  company: string // rsystems
  designation: string // team leader
  skills: string[] // [html,css,scss]
  award: string // []
  from: Date | null // 14-dec-2018
  to?: Date | null // null
  location?: string // Noida
  current?: boolean // true
  active?: boolean // true
  projects?: Project[]
}
export interface Education {
  instituteName: string // kic
  degree: string // BCA
  fieldOfStudy: string
  current?: boolean
  activityAndSocial?: string
  from: Date | null
  to?: Date | null
  location?: string
  summary?: string
  grade?: string
}
export interface Address {}
export interface Profile {
  user: string
  company: string
  designation: string
  gender: string
  dob: string
  summary: string
  hobbies: string[]
  website: string
  resume?: string
  address: string
  qualification: string
  gitusername: string
  totalExp: number
  noticeperiod?: number
  languages: Language[] | null
  salary?: number
  skills?: Skill[]
  employment?: Employment[]
  education?: Education[]
  social: Social
  active: boolean
}
export interface ProfileDoc extends Document<Profile>, Profile {}

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: USER_TABLE, required: true },
    company: { type: String, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true, default: 'male', enum: ['male', 'female', 'unkown'] },
    dob: { type: Date, default: '' },
    summary: { type: String, minlength: 0, maxlength: 500 },
    hobbies: { type: [String], default: [] },
    website: { type: String, default: '' },
    resume: { type: String, default: '' },
    address: { type: String, default: '' },
    qualification: { type: String, default: '' },
    gitusername: { type: String, default: '' },
    totalExp: { type: String, default: 0 },
    noticeperiod: { type: String, default: 0 },
    languages: [
      {
        code: { type: String, default: '' },
        name: { type: String, default: '' },
        options: [
          {
            read: { type: Boolean, default: false },
            write: { type: Boolean, default: false },
            speak: { type: Boolean, default: false }
          }
        ]
      }
    ],
    skills: [
      {
        title: { type: String },
        proficiency: {
          type: String,
          default: Proficiency.beginer,
          enum: Proficiency
        },
        rating: {
          type: Number,
          default: 0,
          enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
      }
    ],
    education: [
      {
        instituteName: { type: String, required: true },
        summary: { type: String, default: '', minlength: 0, maxlength: 500 },
        degree: { type: String, default: '' },
        fieldOfStudy: { type: String, default: '' },
        from: { type: Date, default: null },
        to: { type: Date, default: null },
        location: { type: String, default: '' },
        activityAndSocial: { type: String, default: '' },
        grade: { type: String, default: '' },
        current: { type: Boolean, default: false }
      }
    ],
    employment: [
      {
        company: { type: String, required: true },
        designation: { type: String, required: true },
        summery: { type: String, minLength: 0, maxLength: 120 },
        location: { type: String, default: '' },
        from: { type: Date, default: null },
        to: { type: Date, default: null },
        current: { type: Boolean, default: false },
        award: { type: String, defautl: '' },
        skills: { type: [String], default: [] },
        projects: [
          {
            name: { type: String, default: '' },
            role: { type: String, default: '' },
            duration: { type: String, default: '' },
            frontendIn: { type: String, default: '' },
            backendIn: { type: String, default: '' },
            teamSize: { type: String, default: 0 },
            database: { type: String, default: '' },
            cssOrFramework: { type: String, default: '' },
            helperTechnologies: { type: [String], default: [] },
            projectUrl: { type: String, default: '' }
          }
        ]
      }
    ],
    social: {
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' }
    },
    active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    id: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.__v
      }
    }
  }
)
export const Profile = mongoose.model<ProfileDoc>(PROFILE_TABLE, schema)
