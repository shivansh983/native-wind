import CustomScreen from '@/component/screen'
import { useAppStore } from '@/store/useStore'
import { COLORS } from '@/theme/colors'
import { FlatList, StyleSheet, Text, View } from 'react-native'

const HomeScreen = () => {
  const { files, failed, isLoading, loadFiles, pickFile } = useAppStore()

  // from the files table
  const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0)
  const totalSize =
    totalBytes < 1024 * 1024
      ? `${(totalBytes / 1024).toFixed(0)} KB`
      : `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`

  return (
    <CustomScreen title="Dashboard" onUpload={pickFile}>
      <View style={styles.grid}>
        <View style={[styles.card, styles.box]}>
          <Text style={styles.label}>Files Stored</Text>
          <Text style={styles.value}>{files.length}</Text>
        </View>

        <View style={[styles.card, styles.box]}>
          <Text style={styles.label}>Total Size</Text>
          <Text style={styles.value}>{totalSize}</Text>
        </View>

        <View style={[styles.card, styles.box]}>
          <Text style={styles.label}>Failed (this run)</Text>
          <Text style={[styles.value, { color: '#dc2626' }]}>{failed}</Text>
        </View>

        <View style={[styles.card, styles.box]}>
          <Text style={styles.label}>Last Upload</Text>
          <Text style={[styles.value, { fontSize: 13, marginTop: 8 }]}>
            {files[0]?.date ?? '--'}
          </Text>
        </View>
      </View>

      {
        // files
      }
      <Text style={[styles.title, { fontSize: 16, marginVertical: 14 }]}>
        Uploaded Files
      </Text>

      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={loadFiles}
        ListEmptyComponent={
          <View style={[styles.card, { alignItems: 'center', paddingVertical: 32 }]}>
            <Text style={styles.label}>No files yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, styles.row]}>
            <View style={styles.fileInfo}>
              <Text style={styles.title} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.label}>
                {item.size} · {item.date}
              </Text>
            </View>
          </View>
        )}
      />
    </CustomScreen>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  // layout
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  box: {
    flexBasis: '45%',
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fileInfo: {
    flex: 1,
    paddingRight: 12,
  },

  // text
  label: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
})
