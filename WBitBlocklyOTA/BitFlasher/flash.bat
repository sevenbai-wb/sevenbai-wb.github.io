esptool.exe -p %1 -b %2 write_flash -z -fm dio -ff 40m -fs detect 0x1000 bootloader_dio_40m.bin 0x8000 partitions.bin 0xe000 boot_app0.bin 0x10000 bit_default.bin
