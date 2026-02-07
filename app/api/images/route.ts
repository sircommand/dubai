import { connectDB } from '@/lib/db'
import { getSession } from '@/lib/auth'
import Image from '@/models/Image'
import { generateImageCode } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const categoryId = request.nextUrl.searchParams.get('categoryId')
    const subcategoryId = request.nextUrl.searchParams.get('subcategoryId')

    const query: any = {}
    if (categoryId) query.categoryId = categoryId
    if (subcategoryId) query.subcategoryId = subcategoryId

    const images = await Image.find(query).sort({ createdAt: -1 })

    return NextResponse.json(images)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const categoryId = formData.get('categoryId') as string
    const subcategoryId = formData.get('subcategoryId') as string
    const price = formData.get('price') as string

    if (!file || !title || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images')
    await fs.mkdir(uploadDir, { recursive: true })

    const buffer = await file.arrayBuffer()
    const filename = `${Date.now()}-${file.name}`
    const filepath = path.join(uploadDir, filename)

    await fs.writeFile(filepath, Buffer.from(buffer))

    const image = new Image({
      title,
      url: `/uploads/images/${filename}`,
      categoryId,
      subcategoryId: subcategoryId || undefined,
      price: price ? parseFloat(price) : undefined,
      code: generateImageCode(),
    })

    await image.save()

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error('Upload image error:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}