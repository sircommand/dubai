import mongoose from 'mongoose'

interface IStatistic extends mongoose.Document {
  type: 'daily' | 'weekly' | 'monthly'
  date: Date
  visits: number
  imageViews: number
}

const statisticSchema = new mongoose.Schema<IStatistic>(
  {
    type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    date: { type: Date, required: true },
    visits: { type: Number, default: 0 },
    imageViews: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.Statistic || mongoose.model<IStatistic>('Statistic', statisticSchema)