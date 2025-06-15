function FooterCompany() {
  return (
    <>
      {/* PHẦN CHÍNH - NỀN VÀNG NHẠT */}
      <footer style={{
        backgroundColor: "#ffff80",
        padding: "20px 10px",
        textAlign: "center",
        fontSize: "16px",
        lineHeight: "1.7",
        color: "#000"
      }}>
        <div>
          <h2 style={{ fontWeight: "normal", fontSize: "22px", marginBottom: "15px", color: "#444" }}>
            KỸ THUẬT, PHỤ TÙNG MÁY CƠ GIỚI
          </h2>

          <div style={{ fontWeight: "bold" }}>
            Hotline đặt mua hàng:{" "}
            <span style={{ color: "red" }}><a href="tel:0966 201 140">0966 201 140</a> Mr Bá Đức</span>
          </div>

          <div>
            Email:{" "}
            <a href="mailto:kythuatmayktm@gmail.com" style={{ color: "#0000ff", fontWeight: "bold" }}>
              kythuatmayktm@gmail.com
            </a>
          </div>

          <div style={{ fontWeight: "bold", margin: "10px 0" }}>
            Địa chỉ vp - Kho phát hàng
          </div>

          <div>
            <span style={{ color: "#0000ff", fontWeight: "bold" }}>Hà Nội:</span>{" "}
            27.12 ICID Complex Lê Trọng Tấn - Hà Đông - Hà Nội
          </div>

          <div>
            <span style={{ color: "#0000ff", fontWeight: "bold" }}>Thanh Hóa:</span>{" "}
            TT Quán Lào - Yên Định - Thanh Hóa
          </div>

          <div>
            <span style={{ color: "#0000ff", fontWeight: "bold" }}>Nghệ An:</span>{" "}
            Ngã 4 Đồng Hiếu Đường HCM - Thái Hòa - Nghệ An
          </div>

          <div>
            <span style={{ color: "#0000ff", fontWeight: "bold" }}>Bình Dương:</span>{" "}
            Khu phố Phú Nghị, Phường Hòa Lợi, thị xã Bến Cát, tỉnh Bình Dương
          </div>

          <div>
            <span style={{ color: "#0000ff", fontWeight: "bold" }}>Cần Thơ:</span>{" "}
            Khu phố Thới An 3, Phường Thuận An, Quận Thốt Nốt, TP Cần Thơ
          </div>

          <div style={{ fontWeight: "bold", margin: "15px 0 5px" }}>
            Tư vấn Kỹ thuật Máy:
          </div>

          <div>
            <b>Kỹ thuật máy John Deere:</b> 0398 490 986
          </div>

          <div>
            <b>Kỹ thuật máy Kubota:</b> 0904 987 558
          </div>

          <div>
            <b>Kỹ thuật máy Yanmar:</b> 097 234 9545
          </div>

          <div style={{ marginTop: "20px" }}>
            <span style={{ color: "#0000ff", fontWeight: "bold" }}>Kythuatmay.vn</span>
            <br/>
            <span style={{ color: "#0000ff", fontWeight: "bold" }}>Thuyluc.shop</span>
          </div>

          <div>
            Kho kỹ thuật máy và phụ tùng trên tay của bạn!
          </div>

          <div style={{ marginTop: "10px", fontWeight: "bold" }}>
            CÔNG TY TNHH KỸ THUẬT MÁY KTM
          </div>

          <div style={{ fontSize: "14px", marginBottom: "10px" }}>
            Giấy phép kinh doanh số 2802799630 do Sở KHĐT T. Thanh Hóa cấp ngày 02/10/2019
          </div>
        </div>
      </footer>

      {/* PHẦN DƯỚI - NỀN VÀNG ĐẬM */}
      <div style={{
        backgroundColor: "#ffc107",
        color: "#fff",
        padding: "10px 15px",
        fontSize: "14px",
        textAlign: "center",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "5px" }}>
          <a href="https://kythuatmay.vn/chinh-sach-quy-dinh-chung" style={{ color: "#fff", textDecoration: "none" }}>Chính sách quy định chung</a>
          <a href="https://kythuatmay.vn/chinh-sach-bao-mat" style={{ color: "#fff", textDecoration: "none" }}>Chính sách bảo mật</a>
        </div>

        <div style={{ fontSize: "14px", color: "#fff", textAlign: "center" }}>
          CÔNG TY TNHH KỸ THUẬT MÁY KTM
          <br />
          Giấy phép kinh doanh số 2802799630 do Sở KHĐT T. Thanh Hóa cấp ngày 02/10/2019
        </div>

        <a href="http://online.gov.vn/Home/WebDetails/61330">
          <img
            src="https://res.cloudinary.com/diwxfpt92/image/upload/v1749379288/logoSaleNoti_whjtfz.png"
            alt="giấy phép"
            style={{ height: "50px" }}
          />
        </a>
      </div>
    </>
  );
}

export default FooterCompany;